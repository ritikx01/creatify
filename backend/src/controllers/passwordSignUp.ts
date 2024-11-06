import mongoose from "mongoose";
import { Request, Response } from "express";
import { IUser, User } from "../models/user";
import { generateCookie } from "../config/authConfig";

export async function passwordSignUp(req: Request, res: Response) {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(401).json({ msg: "All fields are required" });
    return;
  }
  const user = await User.findOne({ email });
  if (user) {
    res.status(401).json({ msg: "User already exists" });
    return;
  }
  try {
    let user = (await User.create({
      email: email,
      password: req.body.password,
    })) as IUser;
    const cookies = generateCookie(user);
    res.cookie(cookies.name, cookies.token, cookies.cookieOptions);
    res.status(200).json({ msg: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
    return;
  }
}
