import { Router } from "express";
import {
  AddUserController,
  // GetAllowedUsersController,
  // GetBlockedUsersController,
  GetOtherUserController,
  // GetPendingUsersController,
  GetUserController,
  UpdateAllowedUserController,
  // GetUsersController,
  UpdatePrivacyHandler,
  UpdateUserHandler,
} from "../controllers/UserController";

const User = (user: Router) => {
  user.post("/", AddUserController);
  user.get("/", GetUserController);
  user.get("/other/:id", GetOtherUserController);
  user.put("/", UpdateUserHandler);
  user.put("/privacy/", UpdatePrivacyHandler);
  user.put("/privacy/allowed/:id", UpdateAllowedUserController);
  // user.get("/list/", GetUsersController);
  // user.get("/pending/", GetPendingUsersController);
  // user.get("/allowed/", GetAllowedUsersController);
  // user.get("/blocked/", GetBlockedUsersController);
};

export default User;
