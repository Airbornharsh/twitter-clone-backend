import { Router } from "express";
import { AddUserController, GetUserController } from "../controllers/UserController";

const User = (user: Router) => {
  user.post("/", AddUserController);
  user.get("/:email", GetUserController);
};

export default User;
