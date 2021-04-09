/*
 * @Author: peanut
 * @Date: 2021-04-09 15:32:11
 * @LastEditors: peanut
 * @LastEditTime: 2021-04-10 01:35:56
 * @Description: file content
 */
import { Request, Response, NextFunction } from "express";
import Post from "../models/post";
import HttpException from "../exceptions/HttpExceptions";
import StatusCodes from "http-status-codes";
import validator from "validator";
// import {requestWithUser} from '../types/requestWithUser'
import {UserDocument} from '../models/user'

let { isEmpty } = validator;

export const getPosts = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const posts = await Post.find();

    res.json({
      success: true,
      data: { posts },
    });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {

    // TODO 三种种方式进行非空断言
    // const user = <UserDocument>req.currentUser
    const user = req.currentUser as UserDocument
    // 两种方式进行非空断言

    const { body } = req.body;

    if (isEmpty(body.trim())) {
      throw new HttpException(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "Body must be not empty",
        {
          body: "The body must be not empty",
        }
      );
    }

    const newPost = new Post({
      body,
      createdAt: new Date().toLocaleString(),
      // 上面已经进行了非空断言下面就可以不加感叹号 `！`进行非空断言了
      username: user.username, // TODO 这是第三种方式 username: user！.username 这里要进行非空断言 user 可能为空，不允许 
      user: user._id           // TODO 这是第三种方式 user: user！._id 这里要进行非空断言 user 可能为空，不允许
    });

    const posts =  await newPost.save();

    res.json(
      { 
        success: true, 
        data: { 
          message: "created successfully",
          posts
        } 
      });
  } catch (error) {
    next(error);
  }
};
