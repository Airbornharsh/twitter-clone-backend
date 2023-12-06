import { Router } from "express";
import Controllers from "../controllers/Controllers";
import { AuthenticateUser } from "../middlewares/AuthMiddleware";

const Notification = (user: Router) => {
  const notification = Router();

  user.use("/notification", notification);

  notification.get(
    "/",
    AuthenticateUser,
    Controllers.GetNotificationsController
  );
};

export default Notification;
