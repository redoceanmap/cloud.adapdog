import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URLS = (process.env.FRONTEND_URL || "http://localhost:3001")
  .split(",")
  .map((url) => url.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || FRONTEND_URLS.includes(origin)) {
        callback(null, true);
        return;
      }
      if (
        process.env.NODE_ENV !== "production" &&
        /^http:\/\/localhost:\d+$/.test(origin)
      ) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
