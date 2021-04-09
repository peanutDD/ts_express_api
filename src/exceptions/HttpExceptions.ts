/*
 * @Author: your name
 * @Date: 2021-04-08 00:50:48
 * @LastEditTime: 2021-04-08 03:08:11
 * @LastEditors: peanut
 * @Description: In User Settings Edit
 * @FilePath: \server\src\exceptions\HttpExceptions.ts
 */
class HttpException extends Error {
  status: number
  message: string
  errors?: any

  constructor(status: number, message: string, errors?: any) {
    super(message)
    this.status = status
    this.message = message
    this.errors = errors
  }
}

export default HttpException