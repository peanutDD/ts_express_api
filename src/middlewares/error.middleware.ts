/*
 * @Author: peanut
 * @Date: 2021-04-08 01:07:23
 * @LastEditors: peanut
 * @LastEditTime: 2021-04-09 16:22:15
 * @Description: file content
 */

import { Request, Response, NextFunction } from "express";
import HttpException from "../exceptions/HttpExceptions";
import StatusCodes from "http-status-codes";

const errorMiddleware = (
  error: HttpException,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR
  const message = error.message || "Something went wrong"
  
  res.status(status).json({
    success: false,
    message,
    error: error.errors
  })

  next(error)
};

export default errorMiddleware