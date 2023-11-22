import { Schema, model } from "mongoose";

const Users = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  userName: {
    type: String,
    trim: true,
  },
  age: {
    type: Number,
    required: false,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  private: {
    type: Boolean,
    required: false,
  },
  profileImage: {
    type: String,
    required: false,
  },
  coverImage: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
  dob: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  website: {
    type: String,
    required: false,
  },
});

const UserModel = model("Users", Users);

export default UserModel;
