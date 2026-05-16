import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "API Running",
  });
});

export default app;
