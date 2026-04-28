import expireJobsCron from "./expire-jobs.js";

const startCronJobs = () => {
  expireJobsCron();
};

export default startCronJobs;
