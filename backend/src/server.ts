import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";

import app from "./app";
import { connectDB } from "./config/db";

const __dirname = path.resolve();

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  await connectDB();
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
