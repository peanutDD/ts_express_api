/*
 * @Author: peanut
 * @Date: 2021-04-09 15:30:53
 * @LastEditors: peanut
 * @LastEditTime: 2021-04-12 21:38:57
 * @Description: file content
 */
import { Schema, model, Document, PaginateModel } from "mongoose";
import { UserDocument } from "./user";
import mongoosePaginate from 'mongoose-paginate-v2'

interface Like {
  username: UserDocument["username"];
  createAt: UserDocument["createdAt"]
}

interface Comment {
  username: PostDocument["username"],
  createdAt: PostDocument["createdAt"],
  body: PostDocument["body"],
  id?: PostDocument["_id"]
}

interface PostModel extends PaginateModel<PostDocument> {
}

export interface PostDocument extends Document {
  body: string;
  createdAt: string;
  username: string;
  user: UserDocument["_id"];
  likes: Like[],
  _id: string,
  comments: Comment[]
}

export const postSchema: Schema = new Schema({
  body: String,
  createdAt: {type: String, default: new Date().toLocaleString()},
  username: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  likes: [
    {
      username: String,
      createAt: String
    }
  ],
  comments: [
    {
      username: String,
      createAt: String,
      body: String
    }
  ]
});

postSchema.plugin(mongoosePaginate)

const Post: PostModel = model<PostDocument, PostModel>("Post", postSchema);

export default Post;