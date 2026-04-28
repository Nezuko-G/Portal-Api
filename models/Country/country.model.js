import { Schema, model } from "mongoose";
import { localizedStringField } from "../../utils/helpers.js";

const CitySchema = new Schema(
  {
    name: {
      ...localizedStringField(),
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const CountrySchema = new Schema(
  {
    name: {
      ...localizedStringField(),
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    cities: [CitySchema],
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Country = model("Country", CountrySchema);
