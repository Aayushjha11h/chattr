export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  chats: "/chats",
  friends: "/friends",
  friendRequests: "/friends/requests",
  groups: "/groups",
  createGroup: "/groups/create",
  search: "/search",
  profile: "/profile",
  settings: "/settings",
} as const;

export const PROTECTED_ROUTES = [
  ROUTES.chats,
  ROUTES.friends,
  ROUTES.groups,
  ROUTES.search,
  ROUTES.profile,
  ROUTES.settings,
];

export const AUTH_ROUTES = [
  ROUTES.login,
  ROUTES.signup,
  ROUTES.forgotPassword,
  ROUTES.resetPassword,
];