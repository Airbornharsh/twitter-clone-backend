import { Router } from "express";
import User from "./User";
import Post from "./Post";

const Route = (router: Router) => {
  router.get("/", (req, res) => {
    res.send("Hello World!");
  });

  const user = Router();
  const post = Router();

  router.use("/user", user);
  router.use("/post", post);

  User(user);
  Post(post);
};

export default Route;
