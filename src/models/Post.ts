import { Schema, model } from "mongoose";

const Posts = new Schema({
  userId:{
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
  },
  postImage: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
});

const PostModel = model("Posts", Posts);

export default PostModel;
