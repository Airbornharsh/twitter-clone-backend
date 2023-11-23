"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const DbConfig_1 = __importDefault(require("./config/DbConfig"));
const app = (0, express_1.default)();
const router = express_1.default.Router();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, DbConfig_1.default)();
app.get("/", (req, res) => {
    res.send("Hello World!");
});
// app.use("/api", router);
// Route(router);
// client
//   .connect()
//   .then(() => {
//     console.log("Connected successfully to server");
//     const postCollection = client.db("database").collection("posts");
//     const userCollection = client.db("database").collection("users");
//     app.get("/user", async (req, res) => {
//       const user = await userCollection.find().toArray();
//       res.send(user);
//     });
//     app.get("/loggedInUser", async (req, res) => {
//       const email = req.query.email;
//       const user = await userCollection.find({ email: email }).toArray();
//       res.send(user);
//     });
//  app.get("/post", async (req, res) => {
//       const post = (await postCollection.find().toArray()).reverse();
//       res.send(post);
//     });
//     app.get("/userPost", async (req, res) => {
//       const email = req.query.email;
//       const post = (
//         await postCollection.find({ email: email }).toArray()
//       ).reverse();
//       res.send(post);
//     });
//     app.post("/register", async (req, res) => {
//       const user = req.body;
//       const result = await userCollection.insertOne(user);
//       res.send(result);
//     });
//     app.post("/post", async (req, res) => {
//       const post = req.body;
//       const result = await postCollection.insertOne(post);
//       res.send(result);
//     });
//     app.patch("/userUpdates/:email", async (req, res) => {
//       const filter = req.params;
//       const profile = req.body;
//       const options = { upsert: true };
//       const updateDoc = { $set: profile };
//       const result = await userCollection.updateOne(filter, updateDoc, options);
//       res.send(result);
//     });
//   })
//   .catch((err) => console.error(err));
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
module.exports = app;
