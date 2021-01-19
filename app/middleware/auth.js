'use strict'

/**
 * 鉴权中间件
 *
 * - 从请求头的 X-Token 字段获取 token，转换成 userId，并赋值到 ctx.userId （token 为空或异常均返回 0）
 * - 预留可从 query 中获取 token，仅用于临时调试使用
 * - 对需要鉴权而未传递正确 token 的请求返回 401 状态码（http status code）
 * - 免鉴权的路径配置在 config.default.js 的 noAuthPath 列表中
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

    const { noAuthPath } = ctx.app.config
    if (ctx.userId === 0 && !noAuthPath.includes(ctx.path)) {
      // 无有效 token 且非免鉴权接口
      ctx.status = 401
      ctx.body = 'Need Auth'
    } else {
      await next()
    }
  }
}
