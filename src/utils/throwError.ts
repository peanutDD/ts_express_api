/*
 * @Author: peanut
 * @Date: 2021-04-10 12:41:53
 * @LastEditors: peanut
 * @LastEditTime: 2021-04-10 12:45:30
 * @Description: file content
 */
import HttpException from '../exceptions/HttpExceptions'
import StatusCodes from 'http-status-codes'

export const throwPostNotFoundError = () => {
  throw new HttpException(StatusCodes.NOT_FOUND, "Post not found")
}