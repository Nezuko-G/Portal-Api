import { Country } from "../../models/Country/country.model.js";
import { BadRequestError, NotFoundError } from "../../utils/error.js";
import { validateObjectId } from "../../utils/validateObjectId.js";
import { getCountryByName } from "../../utils/countries-data.js";
import { cache } from "../../config/cache.js";
import {
  getPreferredLanguage,
  transformDocumentToLanguage,
  getMultilingualFields,
} from "../../utils/languageHelper.js";

const cacheKey = "countries";

// Create a new country
export const createCountryController = async (req, res, next) => {
  try {
    const { name, code, cities } = req.body;

    if (!name || !code) {
      throw new BadRequestError(res._t("country.name_code_required"));
    }

    const countryInfo = getCountryByName(name);
    if (!countryInfo) {
      throw new BadRequestError(res._t("country.invalid_name"));
    }

    if (countryInfo.code.toUpperCase() !== code.toUpperCase()) {
      throw new BadRequestError(res._t("country.code_mismatch"));
    }

    if (!Array.isArray(cities) || cities.length === 0) {
      throw new BadRequestError(res._t("country.cities_required"));
    }

    const cityNames = cities.map((c) => c.name.toLowerCase());
    if (cityNames.length !== new Set(cityNames).size) {
      throw new BadRequestError(res._t("country.duplicate_cities"));
    }

    const existingCountry = await Country.findOne({ name, is_deleted: false });
    if (existingCountry) {
      throw new BadRequestError(res._t("country.already_exists"));
    }

    const newCountry = new Country({ name, code, cities });
    await newCountry.save();

    cache.del(cacheKey);

    res.status(201).json({
      message: res._t("country.created"),
      country: newCountry,
    });
  } catch (error) {
    next(error);
  }
};

// Get all countries with caching
export const getAllCountriesController = async (req, res, next) => {
  try {
    const lang = getPreferredLanguage(req);
    const cacheKeyWithLang = `${cacheKey}_${lang}`;
    const cachedCountries = cache.get(cacheKeyWithLang);
    if (cachedCountries) return res.json(cachedCountries);

    const [countries, total] = await Promise.all([
      Country.find({ is_deleted: false }).select(
        "name code cities createdAt updatedAt",
      ),
      Country.countDocuments({ is_deleted: false }),
    ]);

    const multilingualFields = getMultilingualFields("Country");
    const transformedCountries = transformDocumentToLanguage(
      countries,
      lang,
      multilingualFields,
    );

    const response = {
      message:
        transformedCountries.length === 0
          ? res._t("country.no_countries")
          : res._t("country.fetched_all"),
      total,
      countries: transformedCountries,
    };

    cache.set(cacheKeyWithLang, response);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

// Get a single country by id
export const getOneCountryController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lang = getPreferredLanguage(req);
    validateObjectId(id, "country id");

    const country = await Country.findOne({
      _id: id,
      is_deleted: false,
    }).select("name code cities createdAt updatedAt");

    if (!country) {
      throw new NotFoundError(res._t("country.not_found"));
    }

    const multilingualFields = getMultilingualFields("Country");
    const transformedData = transformDocumentToLanguage(
      country,
      lang,
      multilingualFields,
    );

    res.json({
      message: res._t("country.fetched"),
      country: transformedData,
    });
  } catch (error) {
    next(error);
  }
};

// Soft delete a country
export const deleteCountryController = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateObjectId(id, "country id");

    const country = await Country.findById(id);
    if (!country) throw new NotFoundError(res._t("country.not_found"));
    if (country.is_deleted)
      throw new BadRequestError(res._t("country.already_deleted"));

    country.is_deleted = true;
    await country.save();

    cache.del(cacheKey);

    res.json({
      message: res._t("country.deleted"),
    });
  } catch (error) {
    next(error);
  }
};

// Update country data
export const updateCountryController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const lang = getPreferredLanguage(req);

    validateObjectId(id, "country id");

    if (!updateData || Object.keys(updateData).length === 0) {
      throw new BadRequestError(res._t("country.update_required"));
    }

    const country = await Country.findOneAndUpdate(
      { _id: id, is_deleted: false },
      { $set: updateData },
      { new: true, runValidators: true },
    ).select("name code cities createdAt updatedAt");

    if (!country) {
      throw new NotFoundError(res._t("country.not_found"));
    }

    cache.del(`${cacheKey}_en`);
    cache.del(`${cacheKey}_ar`);

    const multilingualFields = getMultilingualFields("Country");
    const transformedData = transformDocumentToLanguage(
      country,
      lang,
      multilingualFields,
    );

    res.json({
      message: res._t("country.updated"),
      country: transformedData,
    });
  } catch (error) {
    next(error);
  }
};
