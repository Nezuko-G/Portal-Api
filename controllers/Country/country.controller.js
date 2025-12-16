import { Country } from "../../models/Country/country.model.js";
import { BadRequestError, NotFoundError } from "../../Errors/error.js";
import { validateObjectId } from "../../utils/validateObjectId.js";
import { getCountryByName } from "../../utils/countries-data.js";

/***
   Create Country
***/
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

    const existingCountry = await Country.findOne({
      name,
      is_deleted: false,
    });

    if (existingCountry) {
      throw new BadRequestError(res._t("country.already_exists"));
    }

    const newCountry = new Country({ name, code, cities });
    await newCountry.save();

    res.status(201).json({
      message: res._t("country.created"),
      country: newCountry,
    });
  } catch (error) {
    next(error);
  }
};

/***
   Get All Countries
***/
export const getAllCountriesController = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const allowedSortFields = ["name", "createdAt", "updatedAt"];
    const sortBy = allowedSortFields.includes(req.query.sort)
      ? req.query.sort
      : "createdAt";
    const sortOrder = req.query.order === "asc" ? 1 : -1;

    const [countries, total] = await Promise.all([
      Country.find({ is_deleted: false })
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: sortOrder })
        .select("name code cities createdAt updatedAt"),
      Country.countDocuments({ is_deleted: false }),
    ]);

    if (countries.length === 0) {
      return res.json({
        message: res._t("country.no_countries"),
        total,
        countries: [],
      });
    }

    res.json({
      message: res._t("country.fetched_all"),
      total,
      page,
      limit,
      countries,
    });
  } catch (error) {
    next(error);
  }
};

/***
   Get One Country
***/
export const getOneCountryController = async (req, res, next) => {
  try {
    const { id } = req.params;

    validateObjectId(id, "country id");

    const country = await Country.findOne({
      _id: id,
      is_deleted: false,
    }).select("name code cities createdAt updatedAt");

    if (!country) {
      throw new NotFoundError(res._t("country.not_found"));
    }

    res.json({
      message: res._t("country.fetched"),
      country,
    });
  } catch (error) {
    next(error);
  }
};

/***
   Delete Country 
***/
export const deleteCountryController = async (req, res, next) => {
  try {
    const { id } = req.params;

    validateObjectId(id, "country id");

    const country = await Country.findById(id);

    if (!country) {
      throw new NotFoundError(res._t("country.not_found"));
    }

    if (country.is_deleted) {
      throw new BadRequestError(res._t("country.already_deleted"));
    }

    country.is_deleted = true;
    await country.save();

    res.json({
      message: res._t("country.deleted"),
    });
  } catch (error) {
    next(error);
  }
};

/***
   Update Country
***/
export const updateCountryController = async (req, res, next) => {
  try {
    const { id } = req.params;

    validateObjectId(id, "country id");

    if (!req.body || Object.keys(req.body).length === 0) {
      throw new BadRequestError(res._t("country.update_required"));
    }

    const country = await Country.findOneAndUpdate(
      { _id: id, is_deleted: false },
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("name code cities createdAt updatedAt");

    if (!country) {
      throw new NotFoundError(res._t("country.not_found"));
    }

    res.json({
      message: res._t("country.updated"),
      country,
    });
  } catch (error) {
    next(error);
  }
};
