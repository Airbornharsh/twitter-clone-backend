import Filter from "bad-words";
import { Response } from "express";
import * as tf from "@tensorflow/tfjs";
import * as tfn from "@tensorflow/tfjs-node";
import { loadAndPredict } from "./Spam/model/model";

export let AIModel: tf.LayersModel;

export const isAuthorised = (user: any, otherUser: any) => {
  if (user._id.equals(otherUser._id)) {
    return true;
  } else if (otherUser.blocked.some((a: any) => a.equals(user._id))) {
    return false;
  } else if (!otherUser.private) {
    return true;
  } else if (otherUser.allowed.some((a: any) => a.equals(user._id))) {
    return true;
  } else if (otherUser.followers.some((a: any) => a.equals(user._id))) {
    return true;
  } else if (otherUser.following.some((a: any) => a.equals(user._id))) {
    return true;
  } else if (otherUser.pending.some((a: any) => a.equals(user._id))) {
    return false;
  } else if (otherUser.pendingBy.some((a: any) => a.equals(user._id))) {
    return false;
  }
  return false;
};

export const isOtherUserAuthorised = (user: any, otherUser: any) => {
  if (user._id.equals(otherUser._id)) {
    return true;
  } else if (otherUser.blocked.some((a: any) => a.equals(user._id))) {
    return false;
  } else if (!otherUser.private) {
    return true;
  } else if (otherUser.allowed.some((a: any) => a.equals(user._id))) {
    return true;
  } else if (otherUser.followers.some((a: any) => a.equals(user._id))) {
    return true;
  } else if (otherUser.following.some((a: any) => a.equals(user._id))) {
    return true;
  } else if (otherUser.pending.some((a: any) => a.equals(user._id))) {
    return false;
  } else if (otherUser.pendingBy.some((a: any) => a.equals(user._id))) {
    return false;
  }
  return false;
};

export const AIModelInit = async () => {
  const handler = tfn.io.fileSystem(
    "./src/helpers/Spam/model/modelConfig.json"
  );

  AIModel = await tf.loadLayersModel(handler);
};

export const filterTweet = async (res: Response, tweet: string) => {
  // const level = await loadAndPredict(tweet);
  // console.log(level);

  // spam.classify(tweet).then((level: any) => {
  //   console.log(level);
  //   if (level === "spam") {
  //     res.status(400).json({ message: "Tweet contains spam!" });
  //     return true;
  //   }
  // });

  const toxic = await loadAndPredict(tweet);

  if (toxic) {
    res.status(400).json({ message: "Tweet contains bad words!" });
    return true;
  }

  return toxic;
};
