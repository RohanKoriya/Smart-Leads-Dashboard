import dotenv from "dotenv";
dotenv.config();

import express from "express";

import path from "path";
import app from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  await connectDB();

  /*
    PRODUCTION SETUP
  */
  if (process.env.NODE_ENV === "production") {
    const frontendPath = path.resolve(__dirname, "../../frontend/dist");
    app.use(express.static(frontendPath));

    app.get("/*", (_, res) => {
      res.sendFile(path.join(frontendPath, "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
