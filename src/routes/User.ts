import { Router } from "express";
import {
  AddUserController,
  GetOtherUserController,
  GetUserController,
  UpdatePrivacyHandler,
} from "../controllers/UserController";

const User = (user: Router) => {
  user.post("/", AddUserController);
  user.get("/:email", GetUserController);
  user.get("/:email/:otherEmail", GetOtherUserController);
  user.put("/privacy/:email", UpdatePrivacyHandler);
};

export default User;
