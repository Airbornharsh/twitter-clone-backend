import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./config/DbConfig";
import Route from "./routes/Route";
import { AIModelInit } from "./helpers/TweetHelper";
const app = express();
const router = express.Router();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();
AIModelInit();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", router);

Route(router);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

module.exports = app;
