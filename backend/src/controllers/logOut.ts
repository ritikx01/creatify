import { Request, Response } from "express";
import { invalidateCookie } from "../config/authConfig";

function logOut(req: Request, res: Response) {
  const cookies = invalidateCookie();
  res
    .cookie(cookies.name, cookies.token, cookies.cookieOptions)
    .status(200)
    .json({ msg: "User successfully logged out" });
}

export default logOut;
