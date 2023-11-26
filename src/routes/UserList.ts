import { Router } from "express";
import Controllers from "../controllers/Controllers";

const UserList = (user: Router) => {
  const list = Router();

  user.use("/list", list);

  list.get("/", Controllers.GetUsersController);
  list.get("/pending/", Controllers.GetPendingUsersController);
  list.get("/allowed/", Controllers.GetAllowedUsersController);
  list.get("/blocked/", Controllers.GetBlockedUsersController);
  list.get("/following/", Controllers.GetFollowingUsersController);
};

export default UserList;
