import NodeCache from "node-cache";

const checkperiod: number = process.env.NODE_ENV === "test" ? 0 : 600;

// 1 hour in memory
export const cache: NodeCache = new NodeCache({
  stdTTL: 3600,
  checkperiod,
  maxKeys: 5000,
});

/** Reads from the cache */
export function readCache<T>(key: string): T | undefined {
  return cache.get<T>(key);
}

/** Fetches data from the source and stores it in the cache */
export async function fetchAndCache<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const value = await fetcher();
  cache.set(key, value);
  return value;
}