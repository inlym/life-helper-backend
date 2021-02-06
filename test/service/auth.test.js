'use strict'

const { app, assert } = require('egg-mock/bootstrap')

describe('service/auth.js', () => {
  it('createToken - 连续 2 次为同一 userId 生成 token，返回值应相同', async () => {
    const ctx = app.mockContext()

    /** 测试用的用户 ID */
    const userId = 9999999

    const token1 = await ctx.service.auth.createToken(userId)
    const token2 = await ctx.service.auth.createToken(userId)

    // 第 2 次生成时，应返回第 1 次生成的，因此两次的值应该是一样的
    assert(token1 === token2)
  })

  it('getUserIdByToken - 使用无效的 token 应返回 userId 为 0', async () => {
    const ctx = app.mockContext()

    /** 测试用的无效 token */
    const invalidToken = 'abcdefghigas234dsa'

    const userId = await ctx.service.auth.getUserIdByToken(invalidToken)

    assert(userId === 0)
  })

  it('createToken + getUserIdByToken - 随机一个 userId 生成 token，再使用该 token 换取 userId，两个 userId 应一致', async () => {
    const ctx = app.mockContext()

    /** 随机一个较大的值，避免和真实环境冲突 */
    const userId = Math.floor(Math.random() * 100000) + 1000000

    const token = await ctx.service.auth.createToken(userId)
    const res = await ctx.service.auth.getUserIdByToken(token)

    assert(userId === res)
  })
})
