import { AbstractEntity } from 'src/common/abstract.entity'
import { Column, Entity } from 'typeorm'

/**
 * 用户选择定位记录
 *
 *
 * @description
 *
 * ### 实体说明
 *
 * ```markdown
 * 1. 用于记录用于手动选择的“天气关注城市”。
 * 2. 数据来源：
 *     - 客户端（微信小程序）调用 `wx.chooseLocation` 返回的结果。
 *     - 使用腾讯位置服务根据经纬度查询获取的结果。
 * ```
 */
@Entity()
export class WeatherCity extends AbstractEntity {
  @Column({
    name: 'user_id',
    type: 'int',
    comment: '所属人用户 ID',
  })
  userId: number

  // ↓ ↓ ↓  以下 4 项字段数据来源于客户端（微信小程序）调用 `wx.chooseLocation` 返回的结果  ↓ ↓ ↓

  @Column({
    type: 'varchar',
    length: 32,
    comment: '位置名称',
  })
  name: string

  @Column({
    type: 'varchar',
    length: 64,
    comment: '详细地址',
  })
  address: string

  @Column({
    type: 'float',
    precision: 8,
    scale: 5,
    comment: '经度', // 浮点数，范围为-180~180，负数表示西经。使用 gcj02 国测局坐标系
  })
  longitude: number

  @Column({
    type: 'float',
    precision: 8,
    scale: 5,
    comment: '纬度', // 浮点数，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系
  })
  latitude: number

  // ↑ ↑ ↑  以上 4 项字段数据来源于客户端（微信小程序）调用 `wx.chooseLocation` 返回的结果  ↑ ↑ ↑

  @Column({
    name: 'location_id',
    type: 'varchar',
    length: 16,
    comment: '和风天气体系中的 LocationID',
  })
  locationId: string

  @Column({
    type: 'char',
    length: 6,
    comment: '行政区划代码',
  })
  adcode: string

  @Column({
    type: 'varchar',
    length: 64,
    default: '',
    comment: '国家',
  })
  nation: string

  @Column({
    type: 'varchar',
    length: 64,
    default: '',
    comment: '省 / 直辖市',
  })
  province: string

  @Column({
    type: 'varchar',
    length: 64,
    default: '',
    comment: '市 / 地级区 及同级行政区划',
  })
  city: string

  @Column({
    type: 'varchar',
    length: 64,
    default: '',
    comment: '区 / 县级市 及同级行政区划',
  })
  district: string
}
