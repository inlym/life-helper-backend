'use strict'

const { Service } = require('egg')
const dayjs = require('dayjs')

class FormatService extends Service {
  /**
   * 将当前时间和目标时间对比，输出以下文案：
   * 昨天，今天，明天，后天，周一，周二，……
   *
   * @param {string} t 目标时间
   * @returns {string} 格式化周几文案
   */
  weekdayA(t) {
    const target = dayjs(t)
    const now = dayjs()
    const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

    if (now.isSame(target, 'day')) {
      return '今天'
    }

    if (target.add(1, 'day').isSame(now, 'day')) {
      return '昨天'
    }

    if (now.add(1, 'day').isSame(target, 'day')) {
      return '明天'
    }

    if (now.add(2, 'day').isSame(target, 'day')) {
      return '后天'
    }

    return week[parseInt(target.day(), 10)]
  }
}

module.exports = FormatService
