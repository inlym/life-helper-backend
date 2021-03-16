'use strict'

const { Service } = require('egg')

/**
 * 存放一些工具类函数
 */

class UtilsService extends Service {
  /**
   * 用于比较指定数字是否在指定范围内
   * @since 2021-03-05
   * @param {Array<string,number>} arr 给定的数字范围，格式示例：[1,'2-10',23,25,'30-90']
   * @param {number} num 待比较的数字
   * @returns {boolean}
   */
  includeNum(arr, num) {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (typeof item === 'number') {
        if (item === num) {
          return true
        }
      } else if (typeof item === 'string') {
        const [min, max] = item.split('-')
        if (num >= min && num <= max) {
          return true
        }
      }
    }
    return false
  }

  /**
   * 对数字补零到指定位数
   * @param {number} number 被格式化的数字
   * @param {number} digit 格式化的位数
   * @returns {string}
   */
  zerofill(number, digit = 2) {
    const zero = '0'
    for (let i = 0; i < digit; i++) {
      if (number < Math.pow(10, i + 1)) {
        const str = zero.repeat(digit - i - 1) + number.toString()
        return str
      }
    }
    return number
  }
}

module.exports = UtilsService
