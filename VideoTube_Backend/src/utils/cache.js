import redis from "../config/redis.js";

export const getCache = async (key) => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Cache GET error:", error);
    return null;
  }
};

export const setCache = async (key, value, ttl = 60) => {
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttl);
  } catch (error) {
    console.error("Cache SET error:", error);
  }
};

export const deleteCache = async (pattern) => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length) {
      await redis.del(keys);
      console.log("Cache DELETED on data update or del.")
    }
  } catch (error) {
    console.error("Cache DELETE error:", error);
  }
};
