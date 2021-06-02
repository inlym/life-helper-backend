import { Entity, Column } from 'typeorm'
import { BaseEntity } from './base.entity'

/**
 * 用户选择定位记录
 *
 * 说明：
 * 1. 仅记录在小程序端使用 `wx.chooseLocation` 方法调用的结果
 * 2. 不同功能模块使用 `type` 字段标记
 */
@Entity()
export class WeatherCity extends BaseEntity {
  @Column({
    name: 'user_id',
    type: 'int',
    comment: '所属人用户 ID',
  })
  userId: number

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
    type: 'decimal',
    precision: 8,
    scale: 5,
    comment: '经度', // 浮点数，范围为-180~180，负数表示西经。使用 gcj02 国测局坐标系
  })
  longitude: number

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 5,
    comment: '纬度', // 浮点数，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系
  })
  latitude: number

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
    comment: '国家',
  })
  nation: string

  @Column({
    type: 'varchar',
    length: 64,
    comment: '省 / 直辖市',
  })
  province: string

  @Column({
    type: 'varchar',
    length: 64,
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
