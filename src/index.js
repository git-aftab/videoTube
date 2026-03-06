import "dotenv/config";
import logger from "./utils/logger.js";
import express from "express";
import morgan from "morgan";
import connectDB from "./db/index.js";

const PORT = process.env.PORT || 3000;
const app = express();
// dotenv.config();
const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  }),
);

console.log(process.env.MONGO_URI)
connectDB()
  .then(
    app.listen(PORT, () => {
      console.log(`App is listening at http://localhost/${PORT}`);
    }),
  )
  .catch((error) => {
    logger.error("Mongo connection error", error);
    throw error
  });





// console.log("Hello videoTuber!!");
logger.info("Hello world");
// logger.warn("Hello world");
// logger.error("Hello world");
