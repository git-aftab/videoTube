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

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later",
  },

  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
});

const uploadLimiter = rateLimit({
  windowMs: 40 * 60 * 1000, // 1hr
  max: 10, //max 10 attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many upload attempts. Please try again later",
  },

  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
});

export { globaRateLimiter, authRateLimiter, uploadLimiter };
