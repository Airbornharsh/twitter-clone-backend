import { Router } from "express";
import Controllers from "../controllers/Controllers";
import { AuthenticateUser } from "../middlewares/AuthMiddleware";

const UserList = (user: Router) => {
  const list = Router();

  user.use("/list", list);

  list.get("/", AuthenticateUser, Controllers.GetUsersController);
  list.get(
    "/pending/",
    AuthenticateUser,
    Controllers.GetPendingUsersController
  );
  list.get(
    "/allowed/",
    AuthenticateUser,
    Controllers.GetAllowedUsersController
  );
  list.get(
    "/blocked/",
    AuthenticateUser,
    Controllers.GetBlockedUsersController
  );
  list.get(
    "/following/",
    AuthenticateUser,
    Controllers.GetFollowingUsersController
  );
  list.get(
    "/followers/",
    AuthenticateUser,
    Controllers.GetFollowersUsersController
  );
  list.get(
    "/following/:id",
    AuthenticateUser,
    Controllers.GetOtherFollowingUsersController
  );
  list.get(
    "/followers/:id",
    AuthenticateUser,
    Controllers.GetOtherFollowersUsersController
  );
};

export default UserList;
