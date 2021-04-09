'use strict'

/**
 * 辅助函数，用于获取权限相关的参数
 * @this ctx
 * @param {string} name 参数名，'code' 或 'token'
 * @description
 * 获取参数的优先级：
 * 1. 请求头 `Authorization` 字段，格式范例：`Authorization: TOKEN xxxxxxxxxxxx`
 * 2. 指定请求头字段：`X-Lh-Code` 或 `X-Lh-Token`
 * 3. 请求参数：`code` 或 `token`
 */
function getAuthParam(name) {
  const HEADERS_FIELD = {
    code: 'X-Lh-Code',
    token: 'X-Lh-Token',
  }

  if (this.get('Authorization')) {
    const [type, value] = this.get('Authorization').split(' ')
    if (type && value && type.toUpperCase() === name.toUpperCase()) {
      return value
    }
  }

  if (this.get(HEADERS_FIELD[name])) {
    return this.get(HEADERS_FIELD[name])
  }

  if (this.query[name]) {
    return this.query[name]
  }

  return ''
}

/**
 * 鉴权中间件
 */
module.exports = (options) => {
  return async function auth(ctx, next) {
    const code = getAuthParam.call(ctx, 'code')
    const token = getAuthParam.call(ctx, 'token')
    ctx.state.auth = { code, token }

    // token 存在，则直接从 token 中获取 userId
    if (token) {
      ctx.userId = await ctx.service.auth.getUserIdByToken(token)

      // userId 为 0 表示 token 异常，非 0 则表示 token 正常（下同）
      if (ctx.userId) {
        // 存在有效 token（即可以获取 userId），鉴权通过
        ctx.state.auth.type = 'token'
        ctx.state.auth.userId = ctx.userId
        ctx.logger.debug(`[鉴权中间件] token=${token} -> userId=${ctx.userId}`)
        await next()
        return
      }
    }

    // 如果 token 为空或无效，则从 code 中获取 userId
    if (code) {
      ctx.userId = await ctx.service.user.getUserIdByCode(code)

      if (ctx.userId) {
        // 从 code 中能够转换出有效 userId，鉴权通过
        ctx.state.auth.type = 'code'
        ctx.state.auth.userId = ctx.userId
        ctx.logger.debug(`[鉴权中间件] code=${code} -> userId=${ctx.userId}`)
        await next()
        return
      }
    }

    // 免鉴权路径直接放行
    if (options.authless.includes(ctx.path)) {
      await next()
    } else {
      ctx.status = 401
      ctx.body = 'Need Auth'
    }
  }
}
