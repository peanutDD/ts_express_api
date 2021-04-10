/*
 * @Author: peanut
 * @Date: 2021-04-08 14:58:49
 * @LastEditors: peanut
 * @LastEditTime: 2021-04-10 13:16:21
 * @Description: file content
 */

import {
  Schema,
  model,
  Model,
  Document,
  HookNextFunction,
  Query,
} from "mongoose";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/Jwt";

enum Role {
  basic = "basic",
  admin = "admin",
}

interface Address {
  city: string;
  street: string;
}

interface UserModel extends Model<UserDocument> {
  admin: () => Query<UserDocument, UserDocument, {}>;
  orderByUsernameDesc: () => Query<
    UserDocument[],
    UserDocument,
    {}
  >;
}

export interface UserDocument extends Document {
  // admin: () => Query<UserDocument | null, UserDocument, {}>;
  _id?: string;
  username: string;
  email: string;
  password: string;
  _doc?: UserDocument;
  createdAt: string;
  updatedAt: string;
  role: Role;
  addresses: Address[];
  generateToken: () => string;
}

const addressSchema: Schema = new Schema({
  city: String,
  street: String,
});

const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Username must not be empty"],
      minlength: [6, "Username must be at least 6 characters long"],
      maxlength: [20, "Username can be no more than 20 characters long"],
    },
    email: {
      type: String,
      // validate: {
      //   validator: isEmail
      // }
      required: true,
      trim: true,
      match: /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/,
    },
    role: {
      type: String,
      enum: ["basic", "admin"],
      default: "basic",
    },
    password: String,
    address: { type: [addressSchema] },
    // createdAt: { type: String, default: new Date().toString() }, 手动设置时间戳 这里还可以自定义里面的内容
    // createdAt: String, 手动设置时间戳
    // updatedAt: String, 手动设置时间戳
    uuid: { type: String, default: uuidv4() },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false }, // 设置时间戳
  }
);

// 这样也可以设置时间戳
// userSchema.set('timestamps', true)

userSchema.index({ username: 1 });

// 创建一个mongoose instance method
userSchema.methods.generateToken = function (): string {
  const payload: JwtPayload = { id: this._id };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
    expiresIn: "12h",
  });
};
// 创建一个mongoose instance method

// 静态方法
userSchema.static("admin", ():Query<UserDocument | null, UserDocument, {}> => {
  return User.findOne({ username: "peanut" });
});

userSchema.static("orderByUsernameDesc", ():Query<UserDocument[], UserDocument, {}> => {
  return User.find({}).sort({ createAt: 1 });
});
// 静态方法

userSchema.pre<UserDocument>(
  "save",
  async function save(next: HookNextFunction) {
    // 在修改之前进行判断，这也是手动的， 一般用数据库设置就行了
    // if (this.isNew) {
    //   this.createdAt = new Date().toDateString();
    // }
    // this.updatedAt = new Date().toLocaleDateString();

    if (!this.isModified) {
      return next();
    }

    try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
      next();
    } catch (error) {
      next(error);
    }
  }
);

const User: UserModel = model<UserDocument, UserModel>("user", userSchema);

export default User;
