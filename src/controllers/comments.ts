/*
 * @Author: peanut
 * @Date: 2021-04-12 19:50:53
 * @LastEditors: peanut
 * @LastEditTime: 2021-04-12 22:51:02
 * @Description: file content
 */

import { Request, Response, NextFunction } from "express";
import { checkBody } from "../utils/validator";
import { UserDocument } from "../models/user";
import {
  throwActionNotAllowedError,
  throwCommentNotFoundError,
  throwPostNotFoundError,
} from "../utils/throwError";
import Post from "../models/post";

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.currentUser as UserDocument;
    const { id } = req.params;
    const { body } = req.body;

    checkBody(body);

    const post = await Post.findById(id);

    if (post) {
      post.comments.unshift({
        username: user.username,
        createdAt: new Date().toLocaleString(),
        body: body,
      });

      console.log(post.comments);

      await post.save();
      res.json({
        success: true,
        data: { message: "comment was created successfully", post },
      });
    } else {
      throwPostNotFoundError();
    }
  } catch (error) {
    next(error);
  }
};

export const getComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, commentId } = req.params;
    const post = await Post.findById(id);

    if (post) {
      const commentIndex = post.comments.findIndex((c) => c.id === commentId);
      console.log(commentIndex);
      const comment = post.comments[commentIndex];
      if (!comment) {
        throwCommentNotFoundError();
      } else {
        res.json({
          success: true,
          data: { message: "Got the comment successfully", comment },
        });
      }
    } else {
      throwCommentNotFoundError();
    }
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username } = req.currentUser as UserDocument;
    const { id, commentId } = req.params;

    const post = await Post.findById(id);

    if (post) {
      const commentIndex = post.comments.findIndex((c) => c.id === commentId);
      const comment = post.comments[commentIndex];
      if (!comment) {
        throwCommentNotFoundError();
      }
      if (comment.username === username) {
        post.comments.splice(commentIndex, 1);
        await post.save();
        res.json({
          success: true,
          data: { message: "comment was deleted successfully", post },
        });
      } else {
        throwActionNotAllowedError();
      }
    } else {
      throwCommentNotFoundError();
    }
  } catch (error) {
    next(error);
  }
};
