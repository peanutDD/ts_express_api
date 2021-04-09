/*
 * @Author: peanut
 * @Date: 2021-04-08 02:40:09
 * @LastEditors: peanut
 * @LastEditTime: 2021-04-09 16:25:12
 * @Description: file content
 */
import { UserDocument } from "../models/user";
import validator from "validator";

interface RegisterInputError extends Partial<UserDocument> {
  confirmPassword?: string;
}

export interface LoginInputError extends Partial<UserDocument> {
  general?: string;
}

let { isEmpty, equals, isEmail } = validator;

export const validateLoginInput = (
  username: UserDocument["username"],
  password: UserDocument["password"],
) => {
  let errors: LoginInputError = {};

  if (isEmpty(username.trim())) {
    errors.username = "Username must not be empty";
  }

  if (isEmpty(password.trim())) {
    errors.password = "Password must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
}

export const validateRegisterInput = (
  username: UserDocument["username"],
  password: UserDocument["password"],
  confirmPassword: UserDocument["password"],
  email: UserDocument["email"]
) => {
  let errors: RegisterInputError = {};

  if (isEmpty(username.trim())) {
    errors.username = "Username must not be empty";
  }

  if (isEmpty(password.trim())) {
    errors.password = "Password must not be empty";
  }

  if (isEmpty(confirmPassword.trim())) {
    errors.confirmPassword = "Confirmed password must not be empty";
  }

  if (!equals(password, confirmPassword)) {
    errors.confirmPassword = "Passwords must match";
  }

  if (isEmpty(email.trim())) {
    errors.email = "Email must not be empty";
  }

  if (!isEmail(email)) {
    errors.email = "Email must be a valid email address";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
