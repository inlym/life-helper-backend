'use strict'

const { app, assert } = require('egg-mock/bootstrap')

describe('测试helper', () => {
  it('测试 sayHi 函数', async () => {
    const ctx = app.mockContext()
    const res = ctx.helper.sayHi()
    assert(res === 'hello')
  })
})
