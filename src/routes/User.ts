import { Router } from "express";
import Controllers from "../controllers/Controllers";
import Privacy from "./UserPrivacy";
import UserList from "./UserList";
import Notification from "./Notification";
import Conservation from "./Conservation";
import { AuthenticateUser } from "../middlewares/AuthMiddleware";

const User = (router: Router) => {
  const user = Router();

  router.use("/user", user);

  user.post("/", Controllers.AddUserController);
  user.get("/", AuthenticateUser, Controllers.GetUserController);
  user.get("/other/:id", AuthenticateUser, Controllers.GetOtherUserController);
  user.put("/", AuthenticateUser, Controllers.UpdateUserHandler);

  Privacy(user);
  UserList(user);
  Notification(user);
  Conservation(user);
};

export default User;
