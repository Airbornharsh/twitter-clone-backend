"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertUserToPrivate = exports.ConvertUserListToPrivateList = void 0;
const AcceptedUser = (user) => {
    return {
        _id: user._id,
        name: user.name,
        userName: user.userName,
        email: user.email,
        bio: user.bio,
        profileImage: user.profileImage,
        coverImage: user.coverImage,
        dob: user.dob,
        location: user.location,
        website: user.website,
        private: user.private,
        followers: user.followers,
        following: user.following,
        allowed: user.allowed,
        allowedBy: user.allowedBy,
        blocked: user.blocked,
        blockedBy: user.blockedBy,
        pending: user.pending,
        pendingBy: user.pendingBy,
        createdAt: user.createdAt,
    };
};
const NotAcceptedUser = (user) => {
    return {
        _id: user._id,
        name: user.name,
        userName: user.userName,
        email: "",
        bio: "",
        profileImage: "",
        coverImage: "",
        dob: "",
        location: "",
        website: "",
        private: true,
        followers: [],
        following: [],
        allowed: user.allowed,
        allowedBy: [],
        blocked: user.blocked,
        blockedBy: [],
        pending: [],
        pendingBy: [],
        createdAt: user.createdAt,
    };
};
const ConvertUserListToPrivateList = (users, user) => {
    return users.map((otherUser) => {
        if (otherUser.blocked.some((a) => a.equals(user._id))) {
            return NotAcceptedUser(otherUser);
        }
        if (!otherUser.private) {
            return AcceptedUser(otherUser);
        }
        if (otherUser.allowed.some((a) => a.equals(user._id))) {
            return AcceptedUser(otherUser);
        }
        else
            return NotAcceptedUser(otherUser);
    });
};
exports.ConvertUserListToPrivateList = ConvertUserListToPrivateList;
const ConvertUserToPrivate = (otherUser, user) => {
    if (otherUser.blocked.some((a) => a.equals(user._id))) {
        return NotAcceptedUser(otherUser);
    }
    if (!otherUser.private) {
        return AcceptedUser(otherUser);
    }
    if (otherUser.allowed.some((a) => a.equals(user._id))) {
        return AcceptedUser(otherUser);
    }
    else
        return NotAcceptedUser(otherUser);
};
exports.ConvertUserToPrivate = ConvertUserToPrivate;
