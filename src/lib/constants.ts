// App constants
export const APP_NAME = "Polling App";
export const APP_DESCRIPTION = "Create and participate in polls";

// API endpoints
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    PROFILE: "/auth/profile",
    REFRESH: "/auth/refresh",
  },
  POLLS: {
    LIST: "/polls",
    CREATE: "/polls",
    GET: "/polls/:id",
    UPDATE: "/polls/:id",
    DELETE: "/polls/:id",
    VOTE: "/polls/:id/vote",
  },
} as const;

// Navigation items
export const NAV_ITEMS = [
  {
    title: "Home",
    href: "/",
    requiresAuth: false,
  },
  {
    title: "Polls",
    href: "/polls",
    requiresAuth: false,
  },
  {
    title: "Create Poll",
    href: "/polls/create",
    requiresAuth: true,
  },
  {
    title: "My Polls",
    href: "/polls/my",
    requiresAuth: true,
  },
] as const;

// Poll settings
export const POLL_SETTINGS = {
  MAX_OPTIONS: 10,
  MIN_OPTIONS: 2,
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_OPTION_LENGTH: 100,
} as const;

// Date formats
export const DATE_FORMATS = {
  SHORT: "MMM dd, yyyy",
  LONG: "MMMM dd, yyyy 'at' h:mm a",
  RELATIVE: "relative",
} as const;


