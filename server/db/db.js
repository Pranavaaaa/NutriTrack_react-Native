import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

function connectDB() {
  mongoose
    .connect(process.env.DB_CONNECT)
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((err) => {
      console.log("Error connecting to the database", err);
    });
}

module.exports = connectDB;
