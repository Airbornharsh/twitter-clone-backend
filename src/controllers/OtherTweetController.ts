import { RequestHandler } from "express";
import { ErrorResponse } from "../helpers/ErrorHelper";
import UserModel from "../models/User";
import TweetModel from "../models/Tweet";
import { isAuthorised } from "../helpers/TweetHelper";

export const GetOtherTweetController: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");
    const otherTweetId = req.params.id;

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const tweet = await TweetModel.findById(otherTweetId);

    if (!tweet) {
      res.status(404).json({ message: "Tweet not found!" });
      return;
    }

    const otherUser = await UserModel.findById(tweet.userId);

    if (!otherUser) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    if (!isAuthorised(user, otherUser)) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    res.status(200).json({ message: "Tweet found!", tweet });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};
