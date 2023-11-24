import { Router } from "express";
import User from "./User";
import Post from "./Post";

const Route = (router: Router) => {
  router.get("/", (req, res) => {
    res.send("Hello World!");
  });

  User(router);
  // Post(post);
};

export default Route;
