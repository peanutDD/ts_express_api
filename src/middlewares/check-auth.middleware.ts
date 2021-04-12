/*
 * @Author: peanut
 * @Date: 2021-04-09 23:09:53
 * @LastEditors: peanut
 * @LastEditTime: 2021-04-12 18:58:40
 * @Description: file content
 */

import {Request, Response, NextFunction } from "express";
import StatusCodes from "http-status-codes";
import HttpException from "../exceptions/HttpExceptions";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/Jwt";
import User from "../models/user";
// import { requestWithUser } from "../types/requestWithUser";

const checkAuthMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.header("authorization");

  if (authorizationHeader) {
    const token = authorizationHeader.split("Bearer ")[1];

    if (token) {
      try {
        const jwtData = jwt.verify(
          token,
          process.env.JWT_SECRET_KEY!
        ) as JwtPayload;

        const user = await User.findById(jwtData.id);

        if (user) {
          req.currentUser = user; // 给 req 加入一个新对象 currentUser 从而可以通过 res 返回给客户端
          return next();
        } else {
          return next(
            new HttpException(StatusCodes.UNAUTHORIZED, "No such user")
          );
        }
      } catch (error) {
        return next(
          new HttpException(StatusCodes.UNAUTHORIZED, "Invalid/Expired token")
        );
      }
    }
    return next(
      new HttpException(
        StatusCodes.UNAUTHORIZED,
        "Authorization token must be 'Bearer [token]"
      )
    );
  }
  next(
    new HttpException(
      StatusCodes.UNAUTHORIZED,
      "Authorization header must be provided"
    )
  );
};

export default checkAuthMiddleware;
