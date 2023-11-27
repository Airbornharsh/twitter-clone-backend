import { Router } from "express";
import Controllers from "../controllers/Controllers";

const OtherTweet = (tweet: Router) =>{
  const otherTweet = Router();

  tweet.use("/other", otherTweet);

  otherTweet.get("/:id", Controllers.GetOtherTweetController);
}

export default OtherTweet;