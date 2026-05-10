import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redis from "../config/redis.js";

const globaRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 mins --> 100req
  max: 100, // max req per IP

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },

  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
});

export { globaRateLimiter };
