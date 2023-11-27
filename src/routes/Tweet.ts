import { Router } from "express";

const Tweet = (router: Router) => {
  const tweet = Router();

  router.use("/post", tweet);

  tweet.post("/");
};

export default Tweet;
