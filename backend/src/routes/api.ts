import express, { Request, Response } from "express";
import { googleOAuth, googleOauthCallback } from "../controllers/googleOauth";
import { passwordLogin } from "../controllers/passwordLogin";
import { createImage } from "../controllers/createImage";
import { passwordSignUp } from "../controllers/passwordSignUp";
import { checkAuth } from "../middlewares/checkAuth";
import { checkAuthenticated } from "../controllers/checkAuthenticated";
import logOut from "../controllers/logOut";
import getAccountInfo from "../middlewares/getAccountInfo";
import updateAccountInfo from "../middlewares/updateAccountInfo";

const apiRouter = express.Router();

apiRouter.get("/auth/google", googleOAuth);
apiRouter.get("/auth/callback/google", googleOauthCallback);

apiRouter.post("/login", passwordLogin);
apiRouter.post("/logout", logOut);
apiRouter.post("/sign-up", passwordSignUp);
apiRouter.all("/check-auth", checkAuthenticated);

apiRouter.post("/create", checkAuth, createImage);

apiRouter.post("/account-info", checkAuth, getAccountInfo);
apiRouter.post("/account", checkAuth, updateAccountInfo);

export default apiRouter;
