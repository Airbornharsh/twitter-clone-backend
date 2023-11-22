import { Schema, model } from "mongoose";

const PrivacyUser = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  allowed: {
    type: Boolean,
    required: true,
    default: false,
  },
  otherUserId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

const PrivacyUserModel = model("PrivacyUsers", PrivacyUser);

export default PrivacyUserModel;
