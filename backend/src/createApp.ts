import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { checkDatabaseHealth } from "./db/prisma";
import { authRoutes } from "./routes/authRoutes";
import { packageInquiryRoutes } from "./routes/packageInquiryRoutes";
import { siteContentRoutes } from "./routes/siteContentRoutes";
import { uploadRoutes } from "./routes/uploadRoutes";
import { errorHandler, notFound } from "./middleware/errors";

export function createApp() {
  const app = express();
  const allowAllOrigins = env.CORS_ORIGINS.length === 0 || env.CORS_ORIGINS.includes("*");

  app.use(helmet());
  app.use(cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowAllOrigins || env.CORS_ORIGINS.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    methods: ["GET", "HEAD", "POST", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  }));
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.get("/api/health", async (_req, res) => {
    try {
      const db = await checkDatabaseHealth();
      res.status(200).json({ status: "ok", database: "connected", ...db });
    } catch (err) {
      const details = typeof err === "object" && err !== null && "message" in err && typeof err.message === "string"
        ? err.message
        : "Unknown database error";
      res.status(503).json({
        status: "degraded",
        database: "disconnected",
        message: "Backend is running but database is unavailable.",
        details,
      });
    }
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/package-inquiries", packageInquiryRoutes);
  app.use("/api/site-content", siteContentRoutes);
  app.use("/api/uploads", uploadRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
