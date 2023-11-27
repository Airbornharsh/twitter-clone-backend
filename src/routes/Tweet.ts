import { Router } from "express";
import Controllers from "../controllers/Controllers";
import OtherTweet from "./OtherTweet";

const Tweet = (router: Router) => {
  const tweet = Router();

  router.use("/tweet", tweet);

  tweet.post("/", Controllers.AddTweetController);
  tweet.get("/", Controllers.GetTweetsController);
  tweet.get("/replies", Controllers.GetTweetsRepliesController);
  tweet.get("/:id", Controllers.GetTweetController);
  tweet.patch("/like/:id", Controllers.UpdateTweetLikeController);
  tweet.patch("/bookmark/:id", Controllers.UpdateTweetBookmarkController);
  tweet.post("/reply/:id", Controllers.AddTweetReplyHandler);

  OtherTweet(tweet);
};

export default Tweet;
