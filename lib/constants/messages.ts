export const ERROR_MESSAGES = {
  auth: {
    invalidCredentials: "Invalid email or password",
    emailInUse: "Email already in use",
    usernameTaken: "Username already taken",
    weakPassword: "Password must be at least 6 characters",
    invalidUsername: "Username can only contain lowercase letters, numbers, and underscores",
  },
  friends: {
    alreadyFriends: "You are already friends",
    requestPending: "Friend request already pending",
    cannotAddSelf: "You cannot add yourself",
    userNotFound: "User not found",
    blocked: "You have blocked this user",
  },
  groups: {
    notMember: "You are not a member of this group",
    notAdmin: "Only admins can perform this action",
    full: "Group is full",
    wrongPassword: "Incorrect password",
  },
  messages: {
    tooLarge: "Message too large",
    empty: "Message cannot be empty",
    notFound: "Message not found",
  },
  general: {
    unauthorized: "You are not authorized",
    notFound: "Not found",
    serverError: "Something went wrong",
  },
} as const;

export const SUCCESS_MESSAGES = {
  friendRequestSent: "Friend request sent",
  friendRequestAccepted: "Friend request accepted",
  friendRemoved: "Friend removed",
  groupCreated: "Group created successfully",
  joinedGroup: "Joined group",
  profileUpdated: "Profile updated",
  passwordReset: "Password reset email sent",
} as const;