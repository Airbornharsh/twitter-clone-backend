import { Router } from "express";
import {
  AddUserController,
  GetOtherUserController,
  GetUserController,
  UpdatePrivacyHandler,
  UpdateUserHandler,
} from "../controllers/UserController";

const User = (user: Router) => {
  user.post("/", AddUserController);
  user.put("/:email", UpdateUserHandler);
  user.get("/:email", GetUserController);
  user.get("/:email/:otherEmail", GetOtherUserController);
  user.put("/privacy/:email", UpdatePrivacyHandler);
};

export default User;
