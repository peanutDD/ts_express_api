/*
 * @Author: peanut
 * @Date: 2021-04-09 15:32:11
 * @LastEditors: peanut
 * @LastEditTime: 2021-04-12 17:55:20
 * @Description: file content
 */
import { Request, Response, NextFunction } from "express";
import Post from "../models/post";
import { UserDocument } from "../models/user";
import { throwPostNotFoundError } from "../utils/throwError";
import { StatusCodes } from "http-status-codes";
import { checkBody } from "../utils/validator";
import HttpException from "../exceptions/HttpExceptions";
// import {requestWithUser} from '../types/requestWithUser'

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page } = req.query;
    
    const myCustomLabels = {
      totalDocs: "total_count",
      docs: "posts_list",
      limit: "perPage",
      page: "current_page",
      nextPage: "next",
      prevPage: "prev",
      totalPages: "page_count",
      pagingCounter: "slNo",
      meta: "page",
    };

    const _options = {
      page: parseInt(page as string),
      limit: 2,
      customLabels: myCustomLabels,
    };
    
    const posts = await Post.paginate({}, _options);

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
    const post = await Post.findById(id).populate("user", "-password");
    if (post) {
      res.json({
        success: true,
        data: {
          post,
          user: req.currentUser,
        },
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

    const user = req.currentUser as UserDocument;

    if (post) {
      if (user.username === post.username) {
        // {new: true} 表示返回最新的 body 否则将返回之前的旧 body
        const resPost = await Post.findByIdAndUpdate(
          id,
          { body },
          { new: true }
        );
        res.json({
          success: true,
          data: {
            message: "updated successfully",
            post: resPost,
          },
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
          data: { message: "deleted successfully" },
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

export const likePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    const user = req.currentUser as UserDocument;
    console.log(user.like_posts);
    if (post) {
      // 判断当是自己发表的文章时，自己给自己点赞的实现逻辑（此时是自己的账号在登录）
      if (post.likes.find((like) => like.username === post.username)) {
        post.likes = post.likes.filter(
          (like) => like.username !== post.username
        );

        // user.like_posts = user.like_posts.filter((like_post) => like_post.username !== post.username)
        // 这里也可以判断是否点赞 返回数据仅仅是一个 id ,就不像上面判断完会返回 很大一串数据，节省空间
        user.like_posts = user.like_posts.filter((id) => {
          // id !== req.params.id.toString()
          !user.like_posts.includes(id);
        });
      } else if (
        // 判断当是别人登录时，别人给自己点赞的逻辑实现（此时是别的账号给文章的所有人点赞）
        user.username !== post.username &&
        post.likes.find((like) => like.username !== post.username)
      ) {
        post.likes = post.likes.filter((like) => {
          like.username === post.username;
        });

        // user.like_posts = user.like_posts.filter((like_post) => {like_post.username === post.username})
        user.like_posts = user.like_posts.filter((id) => {
          user.like_posts.includes(id);
          // console.log(user.like_posts.includes(_id));
        });
      } else {
        post.likes.push({
          username: user.username, // 表示这篇文章被哪些人喜欢，用户包括自己
          createAt: new Date().toLocaleString(),
        });
        // user.like_posts.push(post); // 表示此用户喜欢哪些文章，包括自己的文章,这是具体数据
        user.like_posts.push(post.id); // 表示此用户喜欢哪些文章，包括自己的文章, 此时存储的是like_posts: id
      }

      await post.save();
      await user.save();

      res.json({
        success: true,
        data: {
          post,
          user,
        },
      });
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
