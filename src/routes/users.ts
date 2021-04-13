/*
 * @Author: peanut
 * @Date: 2021-04-13 13:11:18
 * @LastEditors: peanut
 * @LastEditTime: 2021-04-13 13:40:02
 * @Description: file content
 */
import express, { Router } from "express";
import * as usersController from "../controllers/user";

const router: Router = express.Router();

// 登录注册

router.post("/register", usersController.postRegister);
router.post("/login", usersController.postLogin);

export default router;