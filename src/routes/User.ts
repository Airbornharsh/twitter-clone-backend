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
  user.get("/", GetUserController);
  user.get("/", GetOtherUserController);
  user.get("/list/", GetUsersController);
  user.get("/allowed/", GetAllowedUsersController);
  user.post("/", AddUserController);
  user.put("/", UpdateUserHandler);
  user.put("/privacy/", UpdatePrivacyHandler);
};

export default User;
