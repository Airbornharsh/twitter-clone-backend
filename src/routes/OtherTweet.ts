import { Router } from "express";
import Controllers from "../controllers/Controllers";

const OtherTweet = (tweet: Router) =>{
  const otherTweet = Router();

  tweet.use("/other", otherTweet);
}

export default OtherTweet;