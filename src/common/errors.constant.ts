export interface IError {
  code: number
  message: string
}

/**
 * ### 错误编号划分
 *
 * ```markdown
 * 1. [1xxxx] - 权限相关错误
 * 2. [2xxxx] -
 * 3. [3xxxx] - 普通增删改查中的错误
 * 4. [4xxxx] - 参数错误
 * 5. [5xxxx] -
 * ```
 *
 *
 * ### 模块细分
 */

/**
 * -------------------- [ 权限相关错误 ] --------------------
 *
 * 编号：10000 ~ 199999
 */

/**
 * [场景]：需要登录的接口，未提供有效的鉴权信息，被 “守卫” 拦截。
 */
export const INVALID_AUTH_INFO: IError = {
  code: 10001,
  message: '当前页面需要登录才能访问，请先登录！',
}

/**
 *
 * [场景]：微信登录接口，使用了 `token` 而非 `code` 进行鉴权，正常交互不会出现该错误。
 */
export const WX_LOGIN_FAIL: IError = {
  code: 10002,
  message: '登录失败，可能是当前网络环境较差，请稍后再试！',
}

/**
 * [场景]：向微信服务器使用 `code` 换取 `session` 接口，`code` 无效。
 * [说明]：正常交互不会出现该问题。
 */
export const WX_INVALID_CODE: IError = {
  code: 10003,
  message: '登录失败，可能是当前网络环境较差，请稍后再试！',
}

/**
 * -------------------- [ 普通增删改查中的错误 ] --------------------
 *
 * [编号]：30000 ~ 39999
 */

/**
 * [场景]：通过 ID 查找资源，但该资源未找到（无该 ID 或已被删除）
 */
export const RESOURCE_NOT_FOUND: IError = {
  code: 30001,
  message: '你访问的资源不存在！',
}

/**
 * [场景]：通过 ID 查找资源，该资源存在，但不属于当前用户
 */
export const RESOURCE_UNAUTHORIZED: IError = {
  code: 30002,
  message: '你访问的资源不存在！',
}

/**
 * -------------------- [ 其他类型错误 ] --------------------
 *
 * [说明]
 * 1. 并非特定错误，而是针对某一类型的错误。
 * 2. 真实的错误原因使用日志打印，给用户一个笼统模糊的错误说明。
 *
 * [编号]：90000 ~ 99999
 */

/**
 * [场景]：
 * 1. 不需要让用户知道真实错误原因
 * 2. 疑似抓包攻击，正常交互不会发出该请求
 */
export const UNIVERSAL_ERROR: IError = {
  code: 90000,
  message: '网络好像崩溃了，请稍等一会后再试哦 ~',
}

/**
 * [场景]：
 * 1. 与请求无关的服务端错误
 * 2. 不可预知的第三方接口报错
 */
export const COMMON_SERVER_ERROR: IError = {
  code: 90001,
  message: '服务器开了个小差，请稍后再试！',
}
