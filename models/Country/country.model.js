import { Schema, model } from "mongoose";

const CitySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const CountrySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
  }
);

export const Country = model("Country", CountrySchema);
