/*
 * @Author: peanut
 * @Date: 2021-04-08 21:48:31
 * @LastEditors: peanut
 * @LastEditTime: 2021-04-08 21:49:45
 * @Description: file content
 */
import { UserDocument } from "../models/user";

export interface JwtPayload {
  id: UserDocument["_id"];
}