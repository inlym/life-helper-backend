'use strict'

/** 用于传递 token 的请求头字段 */
const HEADER_TOKEN_FIELD = 'X-Token'

/** 用于传递微信小程序获取的 code 的请求头字段 */
const HEADER_CODE_FIELD = 'X-CODE'

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
    const token = ctx.get(HEADER_TOKEN_FIELD) || ctx.query.token
    const code = ctx.get(HEADER_CODE_FIELD)

    if (token) {
      ctx.userId = await ctx.service.auth.getUserIdByToken(token)

      if (ctx.userId) {
        // 存在有效 token（即可以获取 userId），鉴权通过
        ctx.logger.debug(`从 token 获取 userId - token => ${token} / userId => ${ctx.userId}`)
        await next()
        return
      }
    }

    if (code) {
      ctx.userId = await ctx.service.user.getUserIdByCode(code)

      if (ctx.userId) {
        // 从 code 中能够转换出有效 userId，鉴权通过
        ctx.logger.debug(`从 code 获取 userId - code => ${code} / userId => ${ctx.userId}`)
        await next()
        return
      }
    }

    const { noAuthPath } = ctx.app.config

    if (!noAuthPath.includes(ctx.path)) {
      ctx.status = 401
      ctx.body = 'Need Auth'
    } else {
      await next()
    }
  }
}
