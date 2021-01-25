'use strict'

/** 用于传递 token 的请求头字段 */
const HEADER_TOKEN_FIELD = 'X-Lh-Token'

/** 用于传递微信小程序 wx.login 获取的 code 的请求头字段 */
const HEADER_CODE_FIELD = 'X-Lh-Code'

/**
 * 鉴权中间件
 * 1. 存在 token 则直接从 token 中获取 userId（快），否则从 code 中换取 userId（慢）。
 */
module.exports = () => {
  return async function getUserId(ctx, next) {
    /** 从请求头中获取 token，为方便调试，兼容从 query 中获取 */
    const token = ctx.get(HEADER_TOKEN_FIELD) || ctx.query.token

    /** 从请求头中获取 wx.login 获取的 code */
    const code = ctx.get(HEADER_CODE_FIELD)

    // token 存在，则直接从 token 中获取 userId
    if (token) {
      ctx.userId = await ctx.service.auth.getUserIdByToken(token)

      // userId 为 0 表示 token 异常，非 0 则表示 token 正常（下同）
      if (ctx.userId) {
        // 存在有效 token（即可以获取 userId），鉴权通过
        ctx.logger.debug(`从 token 获取 userId -> token => ${token} / userId => ${ctx.userId}`)
        await next()
        return
      }
    }

    // 如果 token 为空，则从 code 中获取 userId
    if (code) {
      ctx.userId = await ctx.service.user.getUserIdByCode(code)

      if (ctx.userId) {
        // 从 code 中能够转换出有效 userId，鉴权通过
        ctx.logger.debug(`从 code 获取 userId -> code => ${code} / userId => ${ctx.userId}`)
        await next()
        return
      }
    }

    /** 无需鉴权即可访问的接口列表 */
    const { noAuthPath } = ctx.app.config

    // 一般到不了这一步，除非提供了 token 但是是无效的，因此无法获取 userId 时，有下述处理
    if (!noAuthPath.includes(ctx.path)) {
      // 当前接口需要鉴权，则返回 401 错误码，客户端再次执行登录
      ctx.status = 401
      ctx.body = 'Need Auth'
    } else {
      // 当前接口无需鉴权，则直接到下一步
      await next()
    }
  }
}
