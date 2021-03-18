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

  /**
   * 获取指定时间的“年月日”部分
   * @since 2021-03-17
   * @description
   * 输出格式为 '2021-03-17'
   */
  getDate(time) {
    let t = null
    if (!time) {
      t = new Date()
    } else {
      t = new Date(time)
    }
    return `${t.getFullYear()}-${this.zerofill(t.getMonth() + 1)}-${this.zerofill(t.getDate())}`
  }

  /**
   * 将一个对象数组转变为对象
   * @param {Array<object>} arr 对象列表，格式为：[{},{},...]
   * @param {string} key 列表项目中
   * @description
   * 将 [{id:'one', ...}, {id:'two', ...}] 转变为 {'one':{...}, 'two':{...}}
   */
  convertArray2Object(arr, key) {
    if (typeof arr !== 'object' || typeof key !== 'string') {
      throw new Error('参数错误')
    }

    const result = {}

    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (typeof item !== 'object') {
        throw new Error('数组项目必须是一个对象')
      }

      if (!item[key]) {
        throw new Error(`子项目对应的 ${key} 属性不存在`)
      }

      if (result[item[key]]) {
        throw new Error('列表中的对象存在重复的 key 值')
      }

      const prop = item[key]

      delete item[key]
      result[prop] = item
    }

    return result
  }
}

module.exports = UtilsService
