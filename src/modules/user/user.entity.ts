import { Entity, Column } from 'typeorm'

import { AbstractEntity } from 'src/common/abstract.entity'

/**
 * 用户账户表
 *
 * 1. 仅存放与账户权限相关的字段
 * 2. 信息类字段放置于用户信息表中
 */
@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity {
  @Column({
    name: 'register_time',
    type: 'datetime',
    update: false,
    default: () => 'CURRENT_TIMESTAMP',
    comment: '注册时间',
  })
  registerTime: Date

  @Column({
    type: 'varchar',
    length: 32,
    update: false,
    unique: true,
    comment: '微信小程序openid，用于唯一区分小程序用户',
  })
  openid: string

  @Column({
    type: 'varchar',
    length: 32,
    update: false,
    unique: true,
    default: '',
    comment: '用户在开放平台的唯一标识符',
  })
  unionid: string

  @Column({
    type: 'char',
    length: 11,
    default: '',
    comment: '账户手机号，可用于其他客户端登录',
  })
  phone: string
}
