import { RequestHandler } from "express";
import { ErrorResponse } from "../helpers/ErrorHelper";
import TweetModel from "../models/Tweet";
import UserModel from "../models/User";

export const AddTweetController: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");

    const { title, tweetMedia } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    if (!title) {
      res.status(400).json({ message: "Title is required!" });
      return;
    }

    if (tweetMedia && typeof tweetMedia !== "object" && tweetMedia.length > 4) {
      res.status(400).json({ message: "Media cannot be more than 4!" });
      return;
    }

    const tweet = await TweetModel.create({
      userId: user._id,
      email: user.email,
      title,
      tweetMedia,
    });

    await user.updateOne({ $push: { tweets: tweet._id } }).exec();

    res.status(200).json({ message: "Tweet added successfully!", tweet });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const GetTweetsController: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const tweets = (await user.populate("tweets")).tweets;

    res.status(200).json({ message: "Tweets fetched successfully!", tweets });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const GetTweetController: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");
    const tweetId = req.params.id;

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const tweet = await TweetModel.findOne({ _id: tweetId, userId: user._id });

    if (!tweet) {
      res.status(404).json({ message: "Tweet not found!" });
      return;
    }

    res.status(200).json({ message: "Tweet fetched successfully!", tweet });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const AddTweetReplyHandler: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");
    const tweetId = req.params.id;

    const { title, tweetMedia } = req.body;

    if (!title) {
      res.status(400).json({ message: "Title is required!" });
      return;
    }

    if (tweetMedia && typeof tweetMedia !== "object" && tweetMedia.length > 4) {
      res.status(400).json({ message: "Media cannot be more than 4!" });
      return;
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const tweet = await TweetModel.findById(tweetId);

    if (!tweet) {
      res.status(404).json({ message: "Tweet not found!" });
      return;
    }

    const replyTweet = await TweetModel.create({
      userId: user._id,
      email: user.email,
      title,
      tweetMedia,
      reply: tweetId,
    });

    await user
      .updateOne({
        $push: { tweets: replyTweet._id, retweetedTweets: replyTweet._id },
      })
      .exec();

    await tweet.updateOne({ $push: { tweetReply: replyTweet._id } }).exec();

    res
      .status(200)
      .json({ message: "Tweet reply added successfully!", tweet: replyTweet });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const UpdateTweetLikeController: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");
    const tweetId = req.params.id;

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const tweet = await TweetModel.findById(tweetId);

    if (!tweet) {
      res.status(404).json({ message: "Tweet not found!" });
      return;
    }

    const isLiked = tweet.likedBy.includes(user._id);

    if (isLiked) {
      await tweet.updateOne({ $pull: { likedBy: user._id } }).exec();
      await user.updateOne({ $pull: { likedTweets: tweet._id } }).exec();
    } else {
      await tweet.updateOne({ $push: { likedBy: user._id } }).exec();
      await user.updateOne({ $push: { likedTweets: tweet._id } }).exec();
    }

    res
      .status(200)
      .json({ message: "Tweet updated successfully!", isLiked: !isLiked });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const UpdateTweetBookmarkController: RequestHandler = async (
  req,
  res
) => {
  try {
    const email = req.get("email");
    const tweetId = req.params.id;

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const tweet = await TweetModel.findById(tweetId);

    if (!tweet) {
      res.status(404).json({ message: "Tweet not found!" });
      return;
    }

    const isBookmarked = tweet.bookmarkedBy.includes(user._id);

    if (isBookmarked) {
      await tweet.updateOne({ $pull: { bookmarkedBy: user._id } }).exec();
      await user.updateOne({ $pull: { bookmarkedTweets: tweet._id } }).exec();
    } else {
      await tweet.updateOne({ $push: { bookmarkedBy: user._id } }).exec();
      await user.updateOne({ $push: { bookmarkedTweets: tweet._id } }).exec();
    }

    res
      .status(200)
      .json({
        message: "Tweet updated successfully!",
        isBookmarked: !isBookmarked,
      });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};
