import { Router } from "express";
import Controllers from "../controllers/Controllers";

const OtherTweet = (tweet: Router) => {
  const otherTweet = Router();

  tweet.use("/other", otherTweet);

  otherTweet.get("/", Controllers.GetAllOtherTweetController);
  otherTweet.get("/:id", Controllers.GetOtherTweetController);
  otherTweet.get("/list/:otherUserId", Controllers.GetOtherTweetsController);
  otherTweet.get(
    "/list/replies/:otherUserId",
    Controllers.GetOtherTweetsRepliesController
  );
};

export default OtherTweet;
