/*
 * @Author: peanut
 * @Date: 2021-04-08 01:31:11
 * @LastEditors: peanut
 * @LastEditTime: 2021-04-12 16:53:29
 * @Description: file content
 */
import { Request, Response, NextFunction } from "express";
import {
  validateRegisterInput,
  validateLoginInput,
  LoginInputError,
} from "../utils/validator";
import HttpException from "../exceptions/HttpExceptions";
import StatusCodes from "http-status-codes";
import User, { UserDocument } from "../models/user";
// import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";

// const generateToken = (user: IUserDocument): string => {
//   return jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY!, {
//     expiresIn: "1h"
//   });
// };

const throwLoginValidateError = (errors: LoginInputError) => {
  throw new HttpException(
    StatusCodes.UNPROCESSABLE_ENTITY,
    "User login input error",
    errors
  );
};

export const postLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body;
    const { errors, valid } = validateLoginInput(username, password);

    if (!valid) {
      return throwLoginValidateError(errors);
    }

    const user = await User.findOne({ username }).populate("like_posts");

    if (!user) {
      errors.general = "User not found";
      return throwLoginValidateError(errors);
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      errors.general = "Wrong credentials: password not matched";
      return throwLoginValidateError(errors);
    }

    const token = user.generateToken();

    res.json({
      success: true,
      data: {
        token,
        user
      },
    });
  } catch (error) {
    next(error);
  }
};

export const postRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password, confirmPassword, email } = req.body;

    const { errors, valid } = validateRegisterInput(
      username,
      password,
      confirmPassword,
      email
    );

    if (!valid) {
      throw new HttpException(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "User register input error",
        errors
      );
    }

    const user = await User.findOne({ username });

    if (user) {
      throw new HttpException(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "username is taken",
        {
          username: "The name is taken",
        }
      );
    }

    // ???????????????????????????????????????????????????models???????????????????????????????????????
    // const hashPassword = await bcrypt.hash(password, 10)

    const newUser: UserDocument = new User({
      username,
      email,
      password,
      // ???????????????????????????????????????
      // createdAt,
      // updatedAt
    });

    const resUser = await newUser.save();

    //= ?????? userSchema ??????????????? ???????????????????????????????????? ????????????????????????
    const admin = await User.admin();
    console.log(admin);

    const orderByUsernameDesc = await User.orderByUsernameDesc();
    console.log(orderByUsernameDesc);
    //= ?????? userSchema ??????????????? ???????????????????????????????????? ????????????????????????

    // ??????mongoose instance method ????????????
    const token: string = resUser.generateToken();
    // ??????mongoose instance method ????????????

    res.json({
      success: true,
      data: {
        token
      },
    });
  } catch (error) {
    next(error);
  }
};
