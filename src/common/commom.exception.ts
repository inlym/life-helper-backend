import { HttpException, HttpStatus } from '@nestjs/common'

/**
 * 默认错误消息
 *
 *
 * ### 说明
 *
 * ```markdown
 * 1. 用于不想给出真实的错误原因或未知错误。
 * ```
 */
const defaultMessage = '服务器开了个小差，请稍后再试！'

/**
 * 全局通用的异常类
 *
 *
 * ### 说明
 *
 * ```markdown
 * 1. 所有的错误均抛出当前类，不要直接使用 `HttpException`。
 * 2. 响应为包含 `code` 和 `message` 属性的对象。
 * ```
 */
export class CommonException extends HttpException {
  constructor(message = defaultMessage, code = -1, status: number = HttpStatus.INTERNAL_SERVER_ERROR) {
    super({ message, code }, status)
  }
}
