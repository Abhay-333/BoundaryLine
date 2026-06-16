import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { asyncHandler } from "../shared/utils/asyncHandler.js";
import { StatusCodes } from "http-status-codes";
import NotFound from "../shared/error/notFound.error.js";
import unAuthorizeError from "../shared/error/unAuthroize.error.js";
import AppError from "../shared/error/AppError.js";

export const authMiddleware = asyncHandler((req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) throw new NotFound("Token not found");
  const payload = jwt.verify(token, env.ACCESS_TOKEN_SECRET);

  if (!payload)
    throw new unAuthorizeError(
      "UnAuthorized user",
      "Token verification failed.",
    );
    
  req.user = payload;

  next();
});

// Role based access Middleware
export const authorizationMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new unAuthorizeError("UnAuthorized user", "Invalid Role");
    }
    next();
  };
};

// const authGuard = new AuthMiddleware();

// export const authenticate = authGuard.authenticate.bind(authGuard);

// export const authorize = authGuard.authorize.bind(authGuard);
