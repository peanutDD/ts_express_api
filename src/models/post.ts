/*
 * @Author: peanut
 * @Date: 2021-04-09 15:30:53
 * @LastEditors: peanut
 * @LastEditTime: 2021-04-10 01:02:12
 * @Description: file content
 */
import { Schema, model, Document } from "mongoose";
import { UserDocument } from "./user";

interface PostDocument extends Document {
  body: string;
  createdAt: string;
  username: string;
  user: UserDocument["_id"];
}

const postSchema: Schema = new Schema({
  body: String,
  createdAt: {type: String, default: new Date().toLocaleString()},
  username: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  }
});

const Post = model<PostDocument>("Post", postSchema);

export default Post;