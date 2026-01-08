import NodeCache from "node-cache";

// 1 hour in memory
export const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
