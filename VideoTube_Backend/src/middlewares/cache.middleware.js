import { getCache, setCache } from "../utils/cache.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const cacheMiddleWare = (keyBuilder, ttl = 60) => {
  return async (req, res, next) => {
    try {
      const key = keyBuilder(req);
      const cached = await getCache(key);

      if (cached) {
        console.log("===>Cache HIT:", key);
        return res
          .status(200)
          .json(
            new ApiResponse(
              200,
              cached,
              "Data fetched successfully from Cache.",
            ),
          );
      }
      console.log("Cache MISS:", key);

      //   Interceptor response
      const originalJson = res.json.bind(res);

      res.json = (body) => {
        // store only success response
        if (body.success) {
          setCache(key, body.data, ttl);
        }
        return originalJson(body);
      };

      next();

    } catch (error) {
      console.log("Cache middleware error:", error.message);
      next(); // never break the request
    }
  };
};
