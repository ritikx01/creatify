import { Request, Response } from "express";
import { getUser } from "../services/jwt";
import { IUser, User } from "../models/user";

async function getAccountInfo(req: Request, res: Response) {
  const userID = getUser(req.cookies?.sessionID);
  if (userID === undefined) {
    res.status(401).json({ msg: "Please login to continue" });
    return;
  }
  const user = (await User.findOne({ _id: userID })) as IUser;
  if (!user) {
    res.status(404).json({ msg: "User not found" });
    return;
  }
  const userData = {
    email: user.email,
    passwordSet: user.password ? true : false,
    verified: user.verified,
  };
  res.status(200).json(userData);
  return;
}

export default getAccountInfo;
