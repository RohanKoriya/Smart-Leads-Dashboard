import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes";
import testRoutes from "./routes/test.routes";
import roleTestRoutes from "./routes/roleTest.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "API Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/role-test", roleTestRoutes);

export default app;
