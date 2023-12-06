import { Router } from "express";
import Controllers from "../controllers/Controllers";
import { AuthenticateUser } from "../middlewares/AuthMiddleware";

const OtherTweet = (tweet: Router) => {
  const otherTweet = Router();

  tweet.use("/other", otherTweet);

  otherTweet.get("/", AuthenticateUser, Controllers.GetAllOtherTweetController);
  otherTweet.get("/:id", AuthenticateUser, Controllers.GetOtherTweetController);
  otherTweet.get(
    "/list/:otherUserId",
    AuthenticateUser,
    Controllers.GetOtherTweetsController
  );
  otherTweet.get(
    "/list/replies/:otherUserId",
    AuthenticateUser,
    Controllers.GetOtherTweetsRepliesController
  );
};

export default OtherTweet;
