import NodeCache from "node-cache";

const checkperiod: number = process.env.NODE_ENV === "test" ? 0 : 600;

// 1 hour in memory
export const cache: NodeCache = new NodeCache({
  stdTTL: 3600,
  checkperiod,
  maxKeys: 5000,
});


export async function getOrSet<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = cache.get<T>(key);
  if (cached !== undefined) return cached;

  const value = await fetcher();
  cache.set(key, value);
  return value;
}