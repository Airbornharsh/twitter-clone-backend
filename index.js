const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { ServerApiVersion, MongoClient } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bnnzqre.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
// async function run() {
//   try {
//     await client.connect();
//     console.log("Connected correctly to server");
//     const postColection = client.db("database").collection("posts");
//     const userColection = client.db("database").collection("users");

//     app.get("/post", async (req, res) => {
//       const posts = await postColection.find({}).toArray();
//       res.send(posts);
//     });

//     app.post("/post", async (req, res) => {
//       const post = req.body;
//       const result = await postColection.insertOne(post);
//       console.log(result);
//       res.send(result);
//     });

//     console.log("You successfully connected to MongoDB!");
//   } catch (err) {
//     console.log(`Error: ${err}`);
//   } finally {
//     await client.close();
//   }
// }

// run();

client
  .connect()
  .then(() => {
    console.log("Connected successfully to server");
    const postColection = client.db("database").collection("posts");
    const userColection = client.db("database").collection("users");

    app.get("/post", async (req, res) => {
      const posts = await postColection.find({}).toArray();
      res.send(posts);
    });

    app.post("/post", async (req, res) => {
      const post = req.body;
      const result = await postColection.insertOne(post);
      console.log(result);
      res.send(result);
    });
  })
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
