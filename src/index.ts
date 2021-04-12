/*
 * @Author: your name
 * @Date: 2021-04-07 22:29:26
 * @LastEditTime: 2021-04-12 22:14:44
 * @LastEditors: peanut
 * @Description: In User Settings Edit
 * @FilePath: \server\src\index.ts
 */
import express, { Request, Response, Express, NextFunction } from "express";
import mongoose from "mongoose";
import StatusCodes from "http-status-codes";
import HttpException from "./exceptions/HttpExceptions";
import errorMiddleware from "./middlewares/error.middleware";
import * as userController from "./controllers/user";
import * as postController from "./controllers/post";
import "dotenv/config";
import checkAuthMiddleware from "./middlewares/check-auth.middleware";
import Morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import * as commentController from "./controllers/comments";

// import bodyParser from 'body-parser'

const app: Express = express();

app.use(Morgan("dev")) // 开发阶段用于 请求的 日志输出
app.use(helmet()) // 防止xss

var corsOptions = {
  origin: 'https://juejin.cn'
}
app.use(cors(corsOptions))

const port: any = process.env.PORT || 6060;

// app.use(bodyParser.urlencoded({extended: true}))
// app.use(bodyParser.json())
app.use(express.json());

app.post("/users/register", userController.postRegister);
app.post("/users/login", userController.postLogin);

// 必须确认是否登录，保证token不过期，才能访问 posts

// app.use(checkAuthMiddleware)

// app.get("/posts", postController.getPosts)
// app.post("/posts", postController.createPost)

// 可以对上面注释的代码合并
app
  .route("/posts")
  .get(postController.getPosts)
  .post(checkAuthMiddleware, postController.createPost);

// 必须确认是否登录，保证token不过期，才能访问 posts

app
  .route("/posts/:id")
  .get(postController.getPost)
  .put(checkAuthMiddleware, postController.updatePost)
  .delete(checkAuthMiddleware, postController.deletePost)

// 点赞功能 thumbup

app.post("/posts/:id/like",checkAuthMiddleware, postController.likePost)

// 评论功能

app.get("/posts/:id/comment/:commentId", checkAuthMiddleware, commentController.getComment)
app.post("/posts/:id/comment", checkAuthMiddleware, commentController.createComment)
app.delete("/posts/:id/comment/:commentId", checkAuthMiddleware, commentController.deleteComment)

app.use((_req: Request, _res: Response, next: NextFunction) => {
  const error: HttpException = new HttpException(
    StatusCodes.NOT_FOUND,
    "Router Not Found"
  );
  next(error);
});

app.use(errorMiddleware);

const main = async () => {
  mongoose.set("useCreateIndex", true)
  mongoose.set("useNewUrlParser", true)
  mongoose.set("useUnifiedTopology", true)
  await mongoose.connect("mongodb://localhost:27017/ts_express_api", {});

  //监听数据库连接状态
  await mongoose.connection.once("open", () => {});

  await mongoose.connection.once("close", () => {});

  app.listen(port, () => {});
};

main();
