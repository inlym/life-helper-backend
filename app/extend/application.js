'use strict'

const dayjs = require('dayjs')

module.exports = {
  /**
   * 以 2001-01-01 01:01:01 格式字符串返回当前时间
   */
  now() {
    return dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
  },
}
