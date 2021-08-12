import { AbstractEntity } from 'src/common/abstract.entity'
import { Column, Entity } from 'typeorm'

/**
 * 全局共用的定位数据记录表
 *
 * @description
 * 1. 本来计划使用 `location` 做名称的，但是考虑到这个单词使用范围实在太广，为避免引起歧义，使用 `place`。（2021.08.12）
 *
 * @description
 * 1. [数据来源]：`name`, `address`, `longitude`, `latitude` 等 4 个字段来源于在小程序中调用 `wx.chooseLocation` 方法获取，其余字段为通过经纬度使用 `lbsqq` 服务查询获取。
 * 2. [使用说明]：其他表使用外键关联到当前表的主键 ID。
 */
@Entity('place')
export class Place extends AbstractEntity {
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
    comment: '经度',
  })
  longitude: number

  @Column({
    type: 'float',
    precision: 8,
    scale: 5,
    comment: '纬度',
  })
  latitude: number

  @Column({
    type: 'char',
    length: 6,
    default: '',
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
