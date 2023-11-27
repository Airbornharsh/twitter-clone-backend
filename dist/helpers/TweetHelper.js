"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOtherUserAuthorised = exports.isAuthorised = void 0;
const isAuthorised = (user, otherUser) => {
    if (user._id.equals(otherUser._id)) {
        return true;
    }
    else if (otherUser.blocked.some((a) => a.equals(user._id))) {
        return false;
    }
    else if (!otherUser.private) {
        return true;
    }
    else if (otherUser.allowed.some((a) => a.equals(user._id))) {
        return true;
    }
    else if (otherUser.followers.some((a) => a.equals(user._id))) {
        return true;
    }
    else if (otherUser.following.some((a) => a.equals(user._id))) {
        return true;
    }
    else if (otherUser.pending.some((a) => a.equals(user._id))) {
        return false;
    }
    else if (otherUser.pendingBy.some((a) => a.equals(user._id))) {
        return false;
    }
    return false;
};
exports.isAuthorised = isAuthorised;
const isOtherUserAuthorised = (user, otherUser) => {
    if (user._id.equals(otherUser._id)) {
        return true;
    }
    else if (otherUser.blocked.some((a) => a.equals(user._id))) {
        return false;
    }
    else if (!otherUser.private) {
        return true;
    }
    else if (otherUser.allowed.some((a) => a.equals(user._id))) {
        return true;
    }
    else if (otherUser.followers.some((a) => a.equals(user._id))) {
        return true;
    }
    else if (otherUser.following.some((a) => a.equals(user._id))) {
        return true;
    }
    else if (otherUser.pending.some((a) => a.equals(user._id))) {
        return false;
    }
    else if (otherUser.pendingBy.some((a) => a.equals(user._id))) {
        return false;
    }
    return false;
};
exports.isOtherUserAuthorised = isOtherUserAuthorised;
