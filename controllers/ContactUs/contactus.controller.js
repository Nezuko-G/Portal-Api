import { ContactUsModel } from "../../models/ContactUs/contactus.model.js";
import { BadRequestError, NotFoundError } from "../../Errors/error.js";
import { validateObjectId } from "../../utils/validateObjectId.js";
import { slugify } from "../../utils/helpers.js";

export const createContactUsController = async (req, res, next) => {
  try {
    const data = req.body;
    const conflicts = {};
    if (!data.name) {
      conflicts.name = "Name is required";
    }
    if (!data.email) {
      conflicts.email = "Email is required";
    }
    if (!data.message) {
      conflicts.message = "Message is required";
    }
    if (Object.keys(conflicts).length > 0) {
      throw new BadRequestError("Validation Error", conflicts);
    }
    const existingContact = await ContactUsModel.findOne({
      email: data.email,
      is_deleted: false,
    });
    if (existingContact) {
      throw new BadRequestError("Contact message from this email already exists");
    }
    const newContact = new ContactUsModel({
      ...data,
    });
    await newContact.save();
    res.status(201).json({
      message: "Contact message created successfully",
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllContactUsController = async (req, res, next) => {
  try {
    const contacts = await ContactUsModel.find({ is_deleted: false }).select(
      "-__v"
    );
    res.json({
      message: "Contact messages fetched successfully",
      total: contacts.length,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactUsByIdController = async (req, res, next) => {
  try {
    const contactId = req.params.id;
    validateObjectId(contactId);
    const contact = await ContactUsModel.findOne({
      _id: contactId,
      is_deleted: false,
    }).select("-__v");
    if (!contact) {
      throw new NotFoundError("Contact message not found");
    }
    res.json({
      message: "Contact message fetched successfully",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};