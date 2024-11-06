import { Request, Response } from "express";
import { IUser, User } from "../models/user";
import { getUser } from "../services/jwt";

async function updateAccountInfo(req: Request, res: Response) {
  const userID = getUser(req.cookies?.sessionID);
  const user = (await User.findById({ _id: userID })) as IUser;
  if (!user || user.email !== req.body.email || !req.body.password) {
    res.status(400).json({ msg: "Bad request" });
    return;
  }
  try {
    user.password = req.body.password;
    await user.save();
    res.status(200).json({ msg: "Profile details updated" });
    return;
  } catch (e) {
    res.status(400).json({ msg: "Bad request" });
    return;
  }
}

export default updateAccountInfo;
