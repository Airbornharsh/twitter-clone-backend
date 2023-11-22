import { Router } from "express";
import {
  AddUserController,
  GetAllowedUsersController,
  GetOtherUserController,
  GetUserController,
  GetUsersController,
  UpdatePrivacyHandler,
  UpdateUserHandler,
} from "../controllers/UserController";

const User = (user: Router) => {
  user.post("/", AddUserController);
  user.put("/:email", UpdateUserHandler);
  user.get("/:email", GetUserController);
  user.get("/list/:email", GetUsersController);
  user.put("/privacy/:email", UpdatePrivacyHandler);
  user.get("/allowed/:email", GetAllowedUsersController);
  user.get("/:email/:otherEmail", GetOtherUserController);
};

export default User;
