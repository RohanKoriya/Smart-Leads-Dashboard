import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes";
import testRoutes from "./routes/test.routes";
import roleTestRoutes from "./routes/roleTest.routes";
import leadRoutes from "./routes/lead.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? true : process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api", (_req, res) => {
  res.json({
    success: true,
    message: "API Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/role-test", roleTestRoutes);
app.use("/api/leads", leadRoutes);

app.use(errorMiddleware);

export default app;
