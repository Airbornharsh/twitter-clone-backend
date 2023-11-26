"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertUserListToPrivateList = void 0;
const ConvertUserListToPrivateList = (users, user) => {
    return users.map((u) => {
        if (!u.private || u.allowed.some((a) => a.equals(user._id))) {
            return {
                _id: u._id,
                name: u.name,
                userName: u.userName,
                email: u.email,
                bio: u.bio,
                profileImage: u.profileImage,
                coverImage: u.coverImage,
                dob: u.dob,
                location: u.location,
                website: u.website,
                private: u.private,
                followers: u.followers,
                following: u.following,
                allowed: u.allowed,
                allowedBy: u.allowedBy,
                blocked: u.blocked,
                blockedBy: u.blockedBy,
                pending: u.pending,
                pendingBy: u.pendingBy,
                createdAt: u.createdAt,
            };
        }
        else
            return {
                _id: u._id,
                name: u.name,
                userName: u.userName,
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
                allowed: u.allowed,
                allowedBy: [],
                blocked: u.blocked,
                blockedBy: [],
                pending: [],
                pendingBy: [],
                createdAt: u.createdAt,
            };
    });
};
exports.ConvertUserListToPrivateList = ConvertUserListToPrivateList;
