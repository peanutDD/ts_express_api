/*
 * @Author: peanut
 * @Date: 2021-04-08 01:31:11
 * @LastEditors: peanut
 * @LastEditTime: 2021-04-09 14:47:56
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

    const user = await User.findOne({ username });

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

    // 通过这种方式可以对密码进行加密，在models里也可通过在数据库进行加密
    // const hashPassword = await bcrypt.hash(password, 10)

    const newUser: UserDocument = new User({
      username,
      email,
      password,
      // 也可以在这里手动设置时间戳
      // createdAt,
      // updatedAt
    });

    const resUser = await newUser.save();

    //= 测试 userSchema 的静态方法 可以通过数据库设置管理员 给数据库数排序等
    const admin = await User.admin();
    console.log(admin);

    const orderByUsernameDesc = await User.orderByUsernameDesc();
    console.log(orderByUsernameDesc);
    //= 测试 userSchema 的静态方法 可以通过数据库设置管理员 给数据库数排序等

    // 调用mongoose instance method 实例方法
    const token: string = resUser.generateToken();
    // 调用mongoose instance method 实例方法

    res.json({
      success: true,
      data: {
        resUser,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};
