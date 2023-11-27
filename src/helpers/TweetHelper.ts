export const isAuthorised = (user: any, otherUser: any) => {
  if (user._id.equals(otherUser._id)) {
    return true;
  } else if (otherUser.blocked.some((a: any) => a.equals(user._id))) {
    return false;
  } else if (!otherUser.private) {
    return true;
  } else if (otherUser.allowed.some((a: any) => a.equals(user._id))) {
    return true;
  } else if (otherUser.followers.some((a: any) => a.equals(user._id))) {
    return true;
  } else if (otherUser.following.some((a: any) => a.equals(user._id))) {
    return true;
  } else if (otherUser.pending.some((a: any) => a.equals(user._id))) {
    return false;
  } else if (otherUser.pendingBy.some((a: any) => a.equals(user._id))) {
    return false;
  }
  return false;
};

export const isOtherUserAuthorised = (user: any, otherUser: any) => {
  if (user._id.equals(otherUser._id)) {
    return true;
  } else if (otherUser.blocked.some((a: any) => a.equals(user._id))) {
    return false;
  } else if (!otherUser.private) {
    return true;
  } else if (otherUser.allowed.some((a: any) => a.equals(user._id))) {
    return true;
  } else if (otherUser.followers.some((a: any) => a.equals(user._id))) {
    return true;
  } else if (otherUser.following.some((a: any) => a.equals(user._id))) {
    return true;
  } else if (otherUser.pending.some((a: any) => a.equals(user._id))) {
    return false;
  } else if (otherUser.pendingBy.some((a: any) => a.equals(user._id))) {
    return false;
  }
  return false;
}