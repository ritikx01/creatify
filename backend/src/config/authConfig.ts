import { CookieOptions } from "express";
import { invalidUser, setUser } from "../services/jwt";
import { IUser } from "../models/user";
const VALID_DURATION = 7 * 24 * 60 * 60 * 1000;

interface cookieConfig {
  name: string;
  domain?: string;
  token: string;
  cookieOptions: CookieOptions;
}

export function invalidateCookie(): cookieConfig {
  const cookieConfig: cookieConfig = {
    name: "sessionID",
    token: invalidUser(),
    cookieOptions: {
      secure: true,
      maxAge: 0,
      path: "/",
      sameSite: "strict",
      httpOnly: true,
    },
  };
  return cookieConfig;
}
export function generateCookie(user: IUser): cookieConfig {
  const cookieConfig: cookieConfig = {
    name: "sessionID",
    token: setUser(user._id.toString()),
    cookieOptions: {
      secure: true,
      maxAge: VALID_DURATION,
      path: "/",
      sameSite: "strict",
      httpOnly: true,
    },
  };
  return cookieConfig;
}

export const jwtConfig = {
  expiresIn: VALID_DURATION,
};
