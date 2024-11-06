import { Request, Response } from "express";
import { User } from "../models/user";
import { IUser } from "../models/user";
import { setUser } from "../services/jwt";
import { generateCookie } from "../config/authConfig";

export async function passwordLogin(req: Request, res: Response) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(401).json({ msg: "All fields are required" });
    return;
  }

  try {
    const user = (await User.findOne({ email })) as IUser;
    if (!user) {
      res.status(401).json({ msg: "Incorrect Login or Password" });
      return;
    }

    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      res.status(401).json({ msg: "Incorrect Login or Password" });
      return;
    }
    const cookies = generateCookie(user);
    res.cookie(cookies.name, cookies.token, cookies.cookieOptions);
    res.status(200).json({ msg: "Logged In successfully" });
    return;
  } catch (error) {
    console.error("Login error:", error);
    return;
  }
}
