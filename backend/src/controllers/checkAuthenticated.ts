import { Request, Response } from "express";
import { getUser } from "../services/jwt";

export function checkAuthenticated(req: Request, res: Response) {
  const user = getUser(req.cookies?.sessionID);
  if (user === undefined) {
    res.status(401).end();
    return;
  }
  res.status(200).end();
  return;
}
