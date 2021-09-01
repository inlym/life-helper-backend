import { Injectable } from '@nestjs/common'

export interface SkyClass {
  bgClass: string
  sun: boolean
  fixedCloud: boolean
  movingCloud: boolean
  darkCloud: boolean
  fullmoon: boolean
}

/**
 * ### 功能说明
 *
 * ```markdown
 * 1. 一些辅助类的方法。
 * ```
 */
@Injectable()
export class WeatherUtilService {
  /**
   * 根据和风天气的图标数字，输出展示的天空元素
   *
   * @since 2021-03-17
   * @tag [和风天气]
   * @param {string} icon 和风天气的 icon id
   *
   * 背景类：
   * - 普通 wbg-common
   * - 夜晚 wbg-night
   * - 小中雨 wbg-lightrain
   * - 灰暗 wbg-grey
   *
   * 天空元素类：
   * - 满月 fullmoon
   * - 半月 halfmoon
   * - 太阳 sun
   * - 固定云 fixed-cloud
   * - 浮动云 moving-cloud
   * - 乌云 darkcloud
   * - 雨点 rain
   *
   * 1-晴、2-云、3-阴、4-雨、5-雪、6-雾、7-尘
   */
  skyClass(icon: string): SkyClass {
    const iconId = parseInt(icon, 10)

    /** 最终输出的内容 */
    const result = {
      bgClass: 'wbg-grey',
      sun: true,
      fixedCloud: true,
      movingCloud: true,
      darkCloud: true,
      fullmoon: false,
    }

    if ([100, 103, 150, 153].includes(iconId)) {
      result.bgClass = 'wbg-common'
      result.fixedCloud = false
      result.movingCloud = false
      result.darkCloud = false
    } else if ([101, 102].includes(iconId)) {
      result.bgClass = 'wbg-common'
      result.movingCloud = false
      result.darkCloud = false
    } else if ([104, 154].includes(iconId)) {
      result.bgClass = 'wbg-common'
      result.darkCloud = false
    } else if (iconId >= 300 && iconId < 400) {
      result.bgClass = 'wbg-lightrain'
    }

    /** 当前时间的 小时 */
    const hour = new Date().getHours()

    if (hour <= 6 || hour >= 18) {
      result.sun = false
      result.fullmoon = true
      result.bgClass = 'wbg-night'
    }
    return result
  }
}
