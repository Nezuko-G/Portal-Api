import { Schema, model } from "mongoose";

const JobApplicationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    is_deleted: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const JobApplicationModel = model(
  "JobApplication",
  JobApplicationSchema,
);
