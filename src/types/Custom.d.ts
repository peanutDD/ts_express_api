/*
 * @Author: peanut
 * @Date: 2021-04-10 01:12:27
 * @LastEditors: peanut
 * @LastEditTime: 2021-04-10 01:33:25
 * @Description: file content
 */
import { UserDocument } from "../models/User";


// 直接在express里定义全局类型  ，那么就会将 req: Request 中新加入 currentUser 对象 ，就不用到处引入 requestWithUser.ts 了
// "dev": "nodemon --exec ts-node --files src/index.ts" 加入 --files 进行全局读取 
declare global {
  namespace Express {
    export interface Request {
      currentUser?: UserDocument
    }
  }
}