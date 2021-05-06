'use strict'

const dayjs = require('dayjs')
const { v4: uuidv4 } = require('uuid')
const jshttp = require('jshttp')

module.exports = {
  /**
   * 以 2001-01-01 01:01:01 格式字符串返回当前时间
   */
  now() {
    return dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
  },

  /**
   * 获取 32 位长度的字符串（即去掉 4 个短横线的 UUID）
   */
  str32() {
    return uuidv4().replace(/[-]/gu, '').toLowerCase()
  },

  /**
   * `jshttp`
   */
  jshttp: jshttp,
}
