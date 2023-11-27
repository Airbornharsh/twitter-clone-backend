import { Router } from "express";
import Controllers from "../controllers/Controllers";

const Tweet = (router: Router) => {
  const tweet = Router();

  router.use("/tweet", tweet);

  tweet.post("/", Controllers.AddTweetController);
};

export default Tweet;
