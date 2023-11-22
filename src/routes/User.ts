import { Router } from "express";
import {
  AddUserController,
  GetOtherUserController,
  GetUserController,
} from "../controllers/UserController";

const User = (user: Router) => {
  user.post("/", AddUserController);
  user.get("/:email", GetUserController);
  user.get("/:email/:otherEmail", GetOtherUserController);
};

export default User;
