import { RequestHandler } from "express";
import UserModel from "../models/User";
import { ErrorResponse } from "../helpers/ErrorHelper";

export const AddUserController: RequestHandler = async (req, res) => {
  try {
    const user = req.body;

    const checkUser = await UserModel.findOne({ email: user.email });

    if (checkUser) {
      res.status(200).json({ message: "User already exists!" });
      return;
    }

    const newUser = new UserModel(user);
    const result = await newUser.save();
    res.status(200).json({ message: "User added successfully!", user: result });
  } catch (e: any | unknown) {
    ErrorResponse(res, 500, e);
  }
};

export const GetUserController: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");

    const user = await UserModel.findOne({ email });
    res.status(200).json({ message: "User fetched successfully!", user });
  } catch (e: any | unknown) {
    ErrorResponse(res, 500, e);
  }
};

export const GetOtherUserController: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");
    const otherEmail = req.params.id;

    const user = await UserModel.findOne({ email });
    const otherUser = await UserModel.findOne({ email: otherEmail });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    if (!otherUser) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    if (!otherUser?.private) {
      res.status(200).json({ message: "User Found!", user: otherUser });
      return;
    }

    let userCheck = false;
    const privateUser = {
      _id: otherUser?._id,
      name: "Private User",
      email: "",
      userName: "Private User",
      profileImage: "",
      coverImage: "",
      bio: "",
      dob: "",
      location: "",
      website: "",
    };

    user?.allowed.forEach((u: any) => {
      if (u.toString() === otherUser?._id.toString()) {
        userCheck = true;
        return;
      }
    });

    userCheck &&
      res.status(200).json({ message: "User Found!", user: otherUser });

    user?.pending.forEach((u: any) => {
      if (u.toString() === otherUser?._id.toString()) {
        userCheck = false;
        return;
      }
    });

    user?.blocked.forEach((u: any) => {
      if (u.toString() === otherUser?._id.toString()) {
        userCheck = false;
        return;
      }
    });

    if (!userCheck)
      res.status(200).json({ message: "User not allowed!", user: privateUser });
  } catch (e: any | unknown) {
    ErrorResponse(res, 500, e);
  }
};

export const UpdatePrivacyHandler: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");
    const privacy = req.body.private;

    await UserModel.findOneAndUpdate({ email }, { private: privacy });

    res.status(200).json({ message: "Updated the Private" });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const UpdateUserHandler: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");
    const { name, age, profileImage, coverImage, bio, dob, location, website } =
      req.body;

    const data = {};

    // name && (data.name = name);
    Object.assign(
      data,
      name && { name },
      age && { age },
      profileImage && { profileImage },
      coverImage && { coverImage },
      bio && { bio },
      dob && { dob },
      location && { location },
      website && { website }
    );

    await UserModel.findOneAndUpdate({ email }, data);

    res.status(200).json({ message: "Updated the User" });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const UpdateAllowedUserController: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");
    const otherUserId = req.params.id;

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const otherUser = await UserModel.findOne({ _id: otherUserId });

    if (!otherUser) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    await UserModel.findByIdAndUpdate(user._id, {
      $addToSet: { allowed: otherUserId },
      $pull: { pending: otherUserId, blocked: otherUserId },
    });

    await UserModel.findByIdAndUpdate(
      { _id: otherUserId },
      {
        $addToSet: { allowedBy: user._id },
        $pull: { pendingBy: user._id, blockedBy: user._id },
      }
    );

    res.status(200).json({ message: "Updated the Allowed User" });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const UpdatePendingUserController: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");
    const otherUserId = req.params.id;

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const otherUser = await UserModel.findOne({ _id: otherUserId });

    if (!otherUser) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    await UserModel.findByIdAndUpdate(user._id, {
      $addToSet: { pendingBy: otherUserId },
      $pull: { allowedBy: otherUserId, blockedBy: otherUserId },
    });

    await UserModel.findByIdAndUpdate(
      { _id: otherUserId },
      {
        $addToSet: { pending: user._id },
        $pull: { allowed: user._id, blocked: user._id },
      }
    );

    res.status(200).json({ message: "Updated the Pending User" });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const UpdateBlockedUserController: RequestHandler = async (req, res) => {
  try {
    const email = req.get("email");
    const otherUserId = req.params.id;

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const otherUser = await UserModel.findOne({ _id: otherUserId });

    if (!otherUser) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    await UserModel.findByIdAndUpdate(user._id, {
      $addToSet: { blocked: otherUserId },
      $pull: { pending: otherUserId, allowed: otherUserId },
    });

    await UserModel.findByIdAndUpdate(
      { _id: otherUserId },
      {
        $addToSet: { blockedBy: user._id },
        $pull: { pendingBy: user._id, allowedBy: user._id },
      }
    );

    res.status(200).json({ message: "Updated the Blocked User" });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};

export const UpdateUnblockedUserController: RequestHandler = async (
  req,
  res
) => {
  try {
    const email = req.get("email");
    const otherUserId = req.params.id;

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "User not allowed!" });
      return;
    }

    const otherUser = await UserModel.findOne({ _id: otherUserId });

    if (!otherUser) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    await UserModel.findByIdAndUpdate(user._id, {
      $pull: { blocked: otherUserId },
    });

    await UserModel.findByIdAndUpdate(
      { _id: otherUserId },
      {
        $pull: { blockedBy: user._id },
      }
    );

    res.status(200).json({ message: "Updated the Unblocked User" });
  } catch (e) {
    ErrorResponse(res, 500, e);
  }
};
// export const GetUsersController: RequestHandler = async (req, res) => {
//   try {
//     const email = req.get("email");

//     const user = await UserModel.findOne({ email });

//     const oldUsers = await UserModel.find({
//       email: { $ne: email },
//     }).lean();

//     const userIds: string[] = [];

//     oldUsers.forEach((user: { _id: any }) => {
//       userIds.push(user._id.toString());
//     });

//     const users = await PrivacyUserModel.find({
//       userId: user?._id,
//     })
//       .populate("otherUserId")
//       .lean();

//     const addedUsers: string[] = [];

//     const tempUsers = users.map((user: { allowed: any; otherUserId: any }) => {
//       addedUsers.push(user.otherUserId._id.toString());
//       if (!user.allowed) {
//         return {
//           _id: user.otherUserId._id,
//           allowed: user.allowed,
//           private: user.otherUserId.private,
//           name: "Private User",
//           email: "",
//           userName: "Private User",
//           profileImage: "",
//           coverImage: "",
//           bio: "",
//           dob: "",
//           location: "",
//           website: "",
//         };
//       } else {
//         return {
//           _id: user.otherUserId._id,
//           allowed: user.allowed,
//           private: user.otherUserId.private,
//           name: user.otherUserId.name,
//           email: user.otherUserId.email,
//           userName: user.otherUserId.userName,
//           profileImage: user.otherUserId.profileImage,
//           coverImage: user.otherUserId.coverImage,
//           bio: user.otherUserId.bio,
//           dob: user.otherUserId.dob,
//           location: user.otherUserId.location,
//           website: user.otherUserId.website,
//         };
//       }
//     });

//     const filteredUsers = userIds.filter((u: string) => {
//       return !addedUsers.includes(u);
//     });

//     const newUsers = await UserModel.find({
//       _id: { $in: filteredUsers },
//     }).lean();

//     const tempNewUsers = newUsers.map((user: any) => {
//       if (user.private)
//         return {
//           _id: user._id,
//           allowed: false,
//           private: user.private,
//           name: "Private User",
//           email: "",
//           userName: "Private User",
//           profileImage: "",
//           coverImage: "",
//           bio: "",
//           dob: "",
//           location: "",
//           website: "",
//         };
//       else
//         return {
//           _id: user._id,
//           allowed: false,
//           private: user.private,
//           name: user.name,
//           email: user.email,
//           userName: user.userName,
//           profileImage: user.profileImage,
//           coverImage: user.coverImage,
//           bio: user.bio,
//           dob: user.dob,
//           location: user.location,
//           website: user.website,
//         };
//     });

//     const allUsers = [...tempUsers, ...tempNewUsers];

//     res
//       .status(200)
//       .json({ message: "Users fetched successfully!", users: allUsers });
//   } catch (e: any | unknown) {
//     ErrorResponse(res, 500, e);
//   }
// };

// export const GetPendingUsersController: RequestHandler = async (req, res) => {
//   try {
//     const email = req.get("email");

//     const user = await UserModel.findOne({ email });

//     const users = await PrivacyUserModel.find({
//       userId: user?._id,
//       allowed: null,
//     })
//       .populate("otherUserId")
//       .lean();

//     const privateIds: string[] = [];

//     // const tempUsers = [];
//     let pendingUsers: any[] = [];

//     users.forEach((user: { otherUserId: any }) => {
//       if (!user.otherUserId.private) {
//         pendingUsers.push({
//           _id: user.otherUserId._id,
//           name: user.otherUserId.name,
//           email: user.otherUserId.email,
//           private: user.otherUserId.private,
//           userName: user.otherUserId.userName,
//           profileImage: user.otherUserId.profileImage,
//           coverImage: user.otherUserId.coverImage,
//           bio: user.otherUserId.bio,
//           dob: user.otherUserId.dob,
//           location: user.otherUserId.location,
//           website: user.otherUserId.website,
//         });
//       } else {
//         privateIds.push(user.otherUserId._id.toString());
//       }
//     });

//     const tempPrivacyUsers = await PrivacyUserModel.find({
//       otherUserId: { $in: privateIds },
//     })
//       .populate("otherUserId")
//       .lean();

//     const tempUsers = tempPrivacyUsers.map(
//       (user: { allowed: any; otherUserId: any }) => {
//         if (!user.allowed) {
//           return {
//             _id: user.otherUserId._id,
//             allowed: user.allowed,
//             private: user.otherUserId.private,
//             name: "Private User",
//             email: "",
//             userName: "Private User",
//             profileImage: "",
//             coverImage: "",
//             bio: "",
//             dob: "",
//             location: "",
//             website: "",
//           };
//         } else {
//           return {
//             _id: user.otherUserId._id,
//             allowed: user.allowed,
//             private: user.otherUserId.private,
//             name: user.otherUserId.name,
//             email: user.otherUserId.email,
//             userName: user.otherUserId.userName,
//             profileImage: user.otherUserId.profileImage,
//             coverImage: user.otherUserId.coverImage,
//             bio: user.otherUserId.bio,
//             dob: user.otherUserId.dob,
//             location: user.otherUserId.location,
//             website: user.otherUserId.website,
//           };
//         }
//       }
//     );

//     pendingUsers = [...pendingUsers, ...tempUsers];

//     res
//       .status(200)
//       .json({ message: "Users fetched successfully!", users: pendingUsers });
//   } catch (e) {
//     ErrorResponse(res, 500, e);
//   }
// };

// export const GetAllowedUsersController: RequestHandler = async (req, res) => {
//   try {
//     const email = req.get("email");

//     const user = await UserModel.findOne({ email });

//     const users = await PrivacyUserModel.find({
//       userId: user?._id,
//       allowed: true,
//     })
//       .populate("otherUserId")
//       .lean();

//     const privateIds: string[] = [];

//     // const tempUsers = [];
//     let allowedUsers: any[] = [];

//     users.forEach((user: { otherUserId: any }) => {
//       if (!user.otherUserId.private) {
//         allowedUsers.push({
//           _id: user.otherUserId._id,
//           name: user.otherUserId.name,
//           email: user.otherUserId.email,
//           private: user.otherUserId.private,
//           userName: user.otherUserId.userName,
//           profileImage: user.otherUserId.profileImage,
//           coverImage: user.otherUserId.coverImage,
//           bio: user.otherUserId.bio,
//           dob: user.otherUserId.dob,
//           location: user.otherUserId.location,
//           website: user.otherUserId.website,
//         });
//       } else {
//         privateIds.push(user.otherUserId._id.toString());
//       }
//     });

//     const tempPrivacyUsers = await PrivacyUserModel.find({
//       otherUserId: { $in: privateIds },
//     })
//       .populate("otherUserId")
//       .lean();

//     const tempUsers = tempPrivacyUsers.map(
//       (user: { allowed: any; otherUserId: any }) => {
//         if (!user.allowed) {
//           return {
//             _id: user.otherUserId._id,
//             allowed: user.allowed,
//             private: user.otherUserId.private,
//             name: "Private User",
//             email: "",
//             userName: "Private User",
//             profileImage: "",
//             coverImage: "",
//             bio: "",
//             dob: "",
//             location: "",
//             website: "",
//           };
//         } else {
//           return {
//             _id: user.otherUserId._id,
//             allowed: user.allowed,
//             private: user.otherUserId.private,
//             name: user.otherUserId.name,
//             email: user.otherUserId.email,
//             userName: user.otherUserId.userName,
//             profileImage: user.otherUserId.profileImage,
//             coverImage: user.otherUserId.coverImage,
//             bio: user.otherUserId.bio,
//             dob: user.otherUserId.dob,
//             location: user.otherUserId.location,
//             website: user.otherUserId.website,
//           };
//         }
//       }
//     );

//     allowedUsers = [...allowedUsers, ...tempUsers];

//     res
//       .status(200)
//       .json({ message: "Users fetched successfully!", users: allowedUsers });
//   } catch (e) {
//     ErrorResponse(res, 500, e);
//   }
// };

// export const GetBlockedUsersController: RequestHandler = async (req, res) => {
//   try {
//     const email = req.get("email");

//     const user = await UserModel.findOne({ email });

//     const users = await PrivacyUserModel.find({
//       userId: user?._id,
//       allowed: false,
//     })
//       .populate("otherUserId")
//       .lean();

//     const privateIds: string[] = [];

//     // const tempUsers = [];
//     let blockedUsers: any[] = [];

//     users.forEach((user: { otherUserId: any }) => {
//       if (!user.otherUserId.private) {
//         blockedUsers.push({
//           _id: user.otherUserId._id,
//           name: user.otherUserId.name,
//           email: user.otherUserId.email,
//           private: user.otherUserId.private,
//           userName: user.otherUserId.userName,
//           profileImage: user.otherUserId.profileImage,
//           coverImage: user.otherUserId.coverImage,
//           bio: user.otherUserId.bio,
//           dob: user.otherUserId.dob,
//           location: user.otherUserId.location,
//           website: user.otherUserId.website,
//         });
//       } else {
//         privateIds.push(user.otherUserId._id.toString());
//       }
//     });

//     const tempPrivacyUsers = await PrivacyUserModel.find({
//       otherUserId: { $in: privateIds },
//     })
//       .populate("otherUserId")
//       .lean();

//     const tempUsers = tempPrivacyUsers.map(
//       (user: { allowed: any; otherUserId: any }) => {
//         if (!user.allowed) {
//           return {
//             _id: user.otherUserId._id,
//             allowed: user.allowed,
//             private: user.otherUserId.private,
//             name: "Private User",
//             email: "",
//             userName: "Private User",
//             profileImage: "",
//             coverImage: "",
//             bio: "",
//             dob: "",
//             location: "",
//             website: "",
//           };
//         } else {
//           return {
//             _id: user.otherUserId._id,
//             allowed: user.allowed,
//             private: user.otherUserId.private,
//             name: user.otherUserId.name,
//             email: user.otherUserId.email,
//             userName: user.otherUserId.userName,
//             profileImage: user.otherUserId.profileImage,
//             coverImage: user.otherUserId.coverImage,
//             bio: user.otherUserId.bio,
//             dob: user.otherUserId.dob,
//             location: user.otherUserId.location,
//             website: user.otherUserId.website,
//           };
//         }
//       }
//     );

//     blockedUsers = [...blockedUsers, ...tempUsers];

//     res
//       .status(200)
//       .json({ message: "Users fetched successfully!", users: blockedUsers });
//   } catch (e) {
//     ErrorResponse(res, 500, e);
//   }
// };
