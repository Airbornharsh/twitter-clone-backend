import { Router } from "express";
import Controllers from "../controllers/Controllers";

const UserList = (user: Router) => {
  const list = Router();

  user.use("/list", list);

  list.get("/", Controllers.GetUsersController);
  // list.get("/pending/", GetPendingUsersController);
  list.get("/allowed/", Controllers.GetAllowedUsersController);
  // list.get("/blocked/", GetBlockedUsersController);
};

export default UserList;
