import { Router } from "express";
import User from "./User";
import Tweet from "./Tweet";

const Route = (router: Router) => {
  router.get("/", (req, res) => {
    res.send("Hello World!");
  });

  User(router);
  Tweet(router);
};

export default Route;
