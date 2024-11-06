import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { IUser, User } from "../models/user";
import { setUser } from "../services/jwt";
import { generateCookie } from "../config/authConfig";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
export async function googleOAuth(req: Request, res: Response) {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  });
  res.redirect(url);
}

interface googleOauthCallbackData {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export async function googleOauthCallback(req: Request, res: Response) {
  const code = req.query.code as string;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const userInfo = await oauth2Client.request<googleOauthCallbackData>({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
    });

    const email = userInfo.data.email;
    if (!email) {
      res.status(500).json({ msg: "Email required" });
      return;
    }
    let user = (await User.findOne({ email })) as IUser;
    if (!user) {
      try {
        user = await User.create({
          email: email,
          password: null,
          givenName: userInfo.data.given_name,
          familyName: userInfo.data.family_name,
          googleId: userInfo.data.id,
          verified: userInfo.data.verified_email,
        });
        res.status(200).json({ msg: "User created successfully" });
      } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Something went wrong" });
        return;
      }
    }
    const cookies = generateCookie(user);
    res.cookie(cookies.name, cookies.token, cookies.cookieOptions);

    // res.status(200).json({ msg: `Login successful for ${email}` });
    const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;
    res.status(200).redirect(`${FRONTEND_BASE_URL}/create`);
    return;
  } catch (error) {
    console.error("Authentication failed", error);
    res.status(500).send("Authentication failed");
  }
}
