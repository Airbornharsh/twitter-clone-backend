"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertUserListToPrivateList = exports.ConvertUserToPrivate = void 0;
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
        tweets: user.tweets,
        likedTweets: user.likedTweets,
        bookmarkedTweets: user.bookmarkedTweets,
        retweetedTweets: user.retweetedTweets,
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
        tweets: [],
        likedTweets: [],
        bookmarkedTweets: [],
        retweetedTweets: [],
        createdAt: user.createdAt,
    };
};
const ConvertUserToPrivate = (otherUser, user) => {
    if (otherUser.blocked.some((a) => a.equals(user._id))) {
        return NotAcceptedUser(otherUser);
    }
    else if (!otherUser.private) {
        return AcceptedUser(otherUser);
    }
    else if (otherUser.allowed.some((a) => a.equals(user._id))) {
        return AcceptedUser(otherUser);
    }
    else if (otherUser._id.equals(user._id))
        return AcceptedUser(otherUser);
    else
        return NotAcceptedUser(otherUser);
};
exports.ConvertUserToPrivate = ConvertUserToPrivate;
const ConvertUserListToPrivateList = (users, user) => {
    return users.map((otherUser) => {
        if (otherUser._id.equals(user._id))
            return AcceptedUser(otherUser);
        else
            return (0, exports.ConvertUserToPrivate)(otherUser, user);
    });
};
exports.ConvertUserListToPrivateList = ConvertUserListToPrivateList;
