import { Router } from "express";
import {
  AddUserController,
  GetAllowedUsersController,
  GetBlockedUsersController,
  GetOtherUserController,
  GetUserController,
  GetUsersController,
  UpdatePrivacyHandler,
  UpdateUserHandler,
} from "../controllers/UserController";

const User = (user: Router) => {
  user.get("/", GetUserController);
  user.get("/other/:otherEmail", GetOtherUserController);
  user.get("/list/", GetUsersController);
  user.get("/allowed/", GetAllowedUsersController);
  user.get("/blocked/", GetBlockedUsersController);
  user.post("/", AddUserController);
  user.put("/", UpdateUserHandler);
  user.put("/privacy/", UpdatePrivacyHandler);
};

export default User;
