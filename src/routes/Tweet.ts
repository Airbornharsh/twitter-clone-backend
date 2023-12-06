import { Router } from "express";
import Controllers from "../controllers/Controllers";
import OtherTweet from "./OtherTweet";
import { AuthenticateUser } from "../middlewares/AuthMiddleware";

const Tweet = (router: Router) => {
  const tweet = Router();

  router.use("/tweet", tweet);

  OtherTweet(tweet);

  tweet.post("/", AuthenticateUser, Controllers.AddTweetController);
  tweet.get("/", AuthenticateUser, Controllers.GetTweetsController);
  tweet.get(
    "/replies",
    AuthenticateUser,
    Controllers.GetTweetsRepliesController
  );
  tweet.get("/:id", AuthenticateUser, Controllers.GetTweetController);
  tweet.patch(
    "/like/:id",
    AuthenticateUser,
    Controllers.UpdateTweetLikeController
  );
  tweet.patch(
    "/bookmark/:id",
    AuthenticateUser,
    Controllers.UpdateTweetBookmarkController
  );
  tweet.post("/reply/:id", AuthenticateUser, Controllers.AddTweetReplyHandler);
};

export default Tweet;
