/*
 * @Author: peanut
 * @Date: 2021-04-13 13:11:09
 * @LastEditors: peanut
 * @LastEditTime: 2021-04-13 13:42:28
 * @Description: file content
 */

import express, { Router } from "express";
import * as postsController from "../controllers/post";
import * as commentsController from "../controllers/comments";
import checkAuthMiddleware from "../middlewares/check-auth.middleware";

const router: Router = express.Router();

// 发表

router
  .route("/")
  .get(postsController.getPosts)
  .post(checkAuthMiddleware, postsController.createPost);

router
  .route("/:id")
  .get(postsController.getPost)
  .put(checkAuthMiddleware, postsController.updatePost)
  .delete(checkAuthMiddleware, postsController.deletePost);

// 点赞

router
  .post("/:id/like", checkAuthMiddleware, postsController.likePost);

// 评论

router
  .post("/:id/comments", checkAuthMiddleware, commentsController.createComment);

router
  .get("/:id/comment/:commentId", checkAuthMiddleware, commentsController.getComment)

router
  .delete("/:id/comments/:commentId", checkAuthMiddleware, commentsController.deleteComment);

export default router;
