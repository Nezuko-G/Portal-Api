import { ContactUsModel } from "../../models/ContactUs/contactus.model.js";
import { BadRequestError, NotFoundError } from "../../utils/error.js";
import { validateObjectId } from "../../utils/validateObjectId.js";

// Create a new contact us entry
export const createContactUsController = async (req, res, next) => {
  try {
    const { body: data } = req;
    const conflicts = {};

    if (!data.name) conflicts.name = res._t("contact_us.name_required");
    if (!data.email) conflicts.email = res._t("contact_us.email_required");
    if (!data.message) conflicts.message = res._t("contact_us.message_required");

    if (Object.keys(conflicts).length > 0) {
      throw new BadRequestError(res._t("contact_us.validation_error"), conflicts);
    }

    const existingContact = await ContactUsModel.findOne({
      email: data.email,
      is_deleted: false,
    });

    if (existingContact) {
      throw new BadRequestError(res._t("contact_us.already_exists"));
    }

    const newContact = new ContactUsModel({ ...data });
    await newContact.save();

    res.status(201).json({
      message: res._t("contact_us.created"),
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

// Get all contact us entries
export const getAllContactUsController = async (req, res, next) => {
  try {
    const contacts = await ContactUsModel.find({ is_deleted: false }).select("-__v");

    res.json({
      message: res._t("contact_us.fetched_all"),
      total: contacts.length,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single contact us entry by id
export const getContactUsByIdController = async (req, res, next) => {
  try {
    const { id: contactId } = req.params;
    validateObjectId(contactId);

    const contact = await ContactUsModel.findOne({
      _id: contactId,
      is_deleted: false,
    }).select("-__v");

    if (!contact) {
      throw new NotFoundError(res._t("contact_us.not_found"));
    }

    res.json({
      message: res._t("contact_us.fetched"),
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};
