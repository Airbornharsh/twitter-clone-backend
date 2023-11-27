import { Router } from "express";
import Controllers from "../controllers/Controllers";

const Tweet = (router: Router) => {
  const tweet = Router();

  router.use("/tweet", tweet);

  tweet.post("/", Controllers.AddTweetController);
  tweet.get("/", Controllers.GetTweetsController);
  tweet.get("/:id", Controllers.GetTweetController);
  tweet.post("/reply/:id", Controllers.AddTweetReplyHandler);
};

export default Tweet;
