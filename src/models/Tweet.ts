import { Schema, model } from "mongoose";

const Tweets = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  tweetMedia: [
    {
      type: String,
      required: false,
    },
  ],
  likedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  bookmarkedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  reply: {
    type: Schema.Types.ObjectId,
    ref: "Tweets",
    default: null,
  },
  tweetReply: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tweets",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const TweetModel = model("Tweets", Tweets);

export default TweetModel;
