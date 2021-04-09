import { Request } from 'express';
import {UserDocument} from '../models/user'
/*
 * @Author: peanut
 * @Date: 2021-04-10 00:19:12
 * @LastEditors: peanut
 * @LastEditTime: 2021-04-10 00:33:13
 * @Description: 对 Request 进行重写，因为 Request 没有 currentUser 对象，要对其进行类型定义
 */

export interface requestWithUser extends Request {
  currentUser?: UserDocument
}