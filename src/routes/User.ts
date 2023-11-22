import { Router } from "express";
import { AddUserController } from "../controllers/UserController";

const User = (user: Router) => {
  user.post("/", AddUserController);
};

export default User;
