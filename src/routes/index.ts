/*
 * @Author: your name
 * @Date: 2021-04-07 22:29:26
 * @LastEditTime: 2021-04-13 13:37:00
 * @LastEditors: peanut
 * @Description: Index.ts Settings Edit
 * @FilePath: \server\src\index.ts
 */
import express, { Router } from "express";

import usersRouter from "./users";
import postsRouter from "./posts";
// import bodyParser from 'body-parser'

const router: Router = express.Router();

router.use("/users", usersRouter);
router.use("/posts", postsRouter);

export default router;