'use strict'

/**
 * 从请求头的 X-Token 字段获取 token，转换成 userId，并赋值到 ctx.userId
 *
 * 备注：
 * - token 为空或异常均返回 0
 * - 预留可从 query 中获取 token，仅用于临时调试使用
 */
module.exports = () => {
  return async function getUserId(ctx, next) {
    const token = ctx.get('X-Token') || ctx.query.token

    if (!token) {
      ctx.userId = 0
      ctx.logger.info('从请求头获取 token 为空')
    } else {
      ctx.userId = await ctx.service.auth.getUserIdByToken(token)
      ctx.logger.info(`从请求头获取 token 为 ${token} ，转换的 userId 为 ${ctx.userId}`)
    }

    await next()
  }
}
