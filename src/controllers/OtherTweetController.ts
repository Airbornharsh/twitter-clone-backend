import { RequestHandler } from "express";
import { ErrorResponse } from "../helpers/ErrorHelper";
import UserModel from "../models/User";
import TweetModel from "../models/Tweet";
import { isAuthorised } from "../helpers/TweetHelper";

export const GetAllOtherTweetController: RequestHandler = async (req, res) => {
  try {
    const user = res.locals.user;

    let tweets = await TweetModel.find({
      reply: null,
    })
      .sort({
        createdAt: -1,
      })
      .populate("userId");

    tweets = tweets
      .filter((tweet) => isAuthorised(user, tweet.userId))
      .sort((a: any, b: any) => b.createdAt - a.createdAt);

    res.status(200).json({ message: "Tweets fetched successfully!", tweets });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const GetOtherTweetsController: RequestHandler = async (req, res) => {
  try {
    const user = res.locals.user;
    const otherUserId = req.params.otherUserId;

    const otherUser = await UserModel.findById(otherUserId);

    if (!otherUser) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    if (!isAuthorised(user, otherUser)) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const tweets = (await otherUser.populate("tweets")).tweets.sort(
      (a: any, b: any) => b.createdAt - a.createdAt
    );

    res.status(200).json({ message: "Tweets fetched successfully!", tweets });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const GetOtherTweetController: RequestHandler = async (req, res) => {
  try {
    const user = res.locals.user;
    const otherTweetId = req.params.id;

    const tweet = await TweetModel.findById(otherTweetId)
      .populate(["userId", "tweetReply"])
      .exec();

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

    tweet.tweetReply = tweet.tweetReply.reverse();

    res.status(200).json({ message: "Tweet found!", tweet });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const GetOtherTweetsRepliesController: RequestHandler = async (
  req,
  res
) => {
  try {
    const user = res.locals.user;
    const otherUserId = req.params.otherUserId;

    const otherUser = await UserModel.findById(otherUserId);

    if (!otherUser) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    if (!isAuthorised(user, otherUser)) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const tweets = (
      await otherUser.populate("retweetedTweets")
    ).retweetedTweets.sort((a: any, b: any) => b.createdAt - a.createdAt);

    res.status(200).json({ message: "Tweets fetched successfully!", tweets });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};
