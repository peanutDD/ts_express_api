/*
 * @Author: peanut
 * @Date: 2021-04-10 12:41:53
 * @LastEditors: peanut
 * @LastEditTime: 2021-04-12 22:02:58
 * @Description: file content
 */
import HttpException from '../exceptions/HttpExceptions'
import StatusCodes from 'http-status-codes'

export const throwPostNotFoundError = () => {
  throw new HttpException(StatusCodes.NOT_FOUND, "Post not found")
}

export const throwCommentNotFoundError = () => {
  throw new HttpException(StatusCodes.NOT_FOUND, "Comment not found")
}


export const throwActionNotAllowedError = () => {
  throw new HttpException(StatusCodes.UNAUTHORIZED, "Action not allowed")
}