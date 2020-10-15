/* eslint-disable no-console */
import dotenv from "dotenv";

import app from "./app.js";

dotenv.config({ path: "./.env" });

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down server...");
  console.log(err.name, err.message);

  process.exit();
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down server...");
  console.log(err.name, err.message);

  server.close(() => {
    process.exit();
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED. Shutting down server...");
  server.close(() => {
    console.log("Process terminated");
  });
});
