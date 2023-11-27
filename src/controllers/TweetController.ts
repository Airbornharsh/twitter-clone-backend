import { RequestHandler } from "express";

export const AddTweetController : RequestHandler= async (req, res) => {
  res.send("Add Tweet");
}
