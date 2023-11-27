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
