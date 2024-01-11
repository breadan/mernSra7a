import mongoose from "mongoose";
import express from "express";
const app = express();
import "dotenv/config";


export default mongoose;
const url = process.env.MONGO_URL;

mongoose
  .connect(url, {})
  .then(() => {
    console.log("posses", process.env.MONGO_URL);
    console.log("db connection established");
  })
  .catch((error) => {
    console.log("db Error", error);
  });

mongoose.connection.on("connected", () => {
  console.log("Mongoose Connected");
});

mongoose.connection.on("error", (err) => {
  console.log(err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose Disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});


