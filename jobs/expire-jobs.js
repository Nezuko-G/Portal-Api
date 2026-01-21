import cron from "node-cron";
import { JobModel } from "../models/Job/job.model.js";

const expireJobsCron = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("Checking expired jobs...");

      const now = new Date();

      const result = await JobModel.updateMany(
        {
          expirationDate: { $lte: now },
          is_active: true,
          is_deleted: false,
        },
        {
          $set: { is_active: false },
        },
      );

      console.log(`${result.modifiedCount} jobs deactivated`);
    } catch (err) {
      console.error("Expire jobs cron error", err);
    }
  });
};

export default expireJobsCron;
