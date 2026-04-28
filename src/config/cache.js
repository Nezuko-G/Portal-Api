import NodeCache from "node-cache";

const checkperiod = process.env.NODE_ENV === "test" ? 0 : 600;

// 1 hour in memory
export const cache = new NodeCache({ stdTTL: 3600, checkperiod });
