/*
* @Author: peanut
* @Date: 2021-04-09 15:32:11
 * @LastEditors: peanut
 * @LastEditTime: 2021-04-11 00:40:32
* @Description: file content
*/
import { Request, Response, NextFunction } from "express";
import Post from "../models/post";
import { UserDocument } from "../models/user";
import { throwPostNotFoundError } from "../utils/throwError";
import { StatusCodes } from 'http-status-codes';
import { checkBody } from "../utils/validator";
import HttpException from '../exceptions/HttpExceptions'
// import {requestWithUser} from '../types/requestWithUser'

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

export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (post) {
      res.json({
        success: true,
        data: { post },
      });
    } else {
      throwPostNotFoundError();
    }
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    const { body } = req.body;
    checkBody(body);
    console.log(body)

    const user = req.currentUser as UserDocument;

    if (post) {
      if (user.username === post.username) {
        // {new: true} 表示返回最新的 body 否则将返回之前的旧 body
        const resPost = await Post.findByIdAndUpdate(id, {body}, { new: true });
        res.json({
          success: true,
          data: {
            message: "updated successfully",
            post: resPost,
          },
        });
      } else {
        throw new HttpException(StatusCodes.UNAUTHORIZED, "Action not allowed")
      }
    } else {
      throwPostNotFoundError();
    }
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    const user = req.currentUser as UserDocument;
    // const user = <UserDocument>(req.currentUser);

    if (post) {
      if (post.username === user.username) {
        await Post.findByIdAndDelete(id);

        res.json({
          success: true,
          data: { message: "deleted successfully" }
        });
      } else {
        throw new HttpException(StatusCodes.UNAUTHORIZED, "Action not allowed");
      }
    } else {
      throwPostNotFoundError();
    }
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
    const user = req.currentUser as UserDocument;
    // 两种方式进行非空断言

    const { body } = req.body;

    checkBody(body);

    const newPost = new Post({
      body,
      createdAt: new Date().toLocaleString(),
      // 上面已经进行了非空断言下面就可以不加感叹号 `！`进行非空断言了
      username: user.username, // TODO 这是第三种方式 username: user！.username 这里要进行非空断言 user 可能为空，不允许
      user: user._id, // TODO 这是第三种方式 user: user！._id 这里要进行非空断言 user 可能为空，不允许
    });

    const posts = await newPost.save();

    res.json({
      success: true,
      data: {
        message: "created successfully",
        posts,
      },
    });
  } catch (error) {
    next(error);
  }
};
