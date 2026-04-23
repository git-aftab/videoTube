import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import logger from "./utils/logger.js";
import passport from "./config/OAuth.js";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// OAuth Config
app.use(passport.initialize());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

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

// import routes
import healthCheckRouter from "./routes/healthCheck.routes.js";
import authRoutes from "./routes/auth.routes.js";
import videoRoutes from "./routes/video.routes.js";
import tweetRoutes from "./routes/tweet.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import likeRoutes from "./routes/like.routes.js";
import playListRoutes from "./routes/playlist.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";

// routes
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/tweet", tweetRoutes);
app.use("/api/v1/playlist", playListRoutes);
app.use("/api/v1/subscribe", subscriptionRoutes);
app.use("/api/v1/like", likeRoutes);

// / route
app.get("/", (req, res) => {
  res.json({
    welcome: "hey this is videoTube BACKEND",
    healthcheck: "/api/v1/healthcheck",
    auth: "/api/v1/auth",
    video: "/api/v1/videos",
    comment: "/api/v1/comment",
    tweet: "/api/v1/tweet",
    playlist: "/api/v1/playlist",
    subscription: "/api/v1/subscribe",
    like: "/api/v1/like",
  });
});

export default app;
