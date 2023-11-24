import { Router } from "express";
import Controllers from "../controllers/Controllers";

const UserList = (user: Router) => {
  const list = Router();

  user.use("/list", list);

  list.get("/", Controllers.GetUsersController);
  // user.get("/pending/", GetPendingUsersController);
  // user.get("/allowed/", GetAllowedUsersController);
  // user.get("/blocked/", GetBlockedUsersController);
};

export default UserList;
