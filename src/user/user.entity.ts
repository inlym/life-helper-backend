import { AbstractEntity } from 'src/common/abstract.entity'
import { Column, Entity } from 'typeorm'

/**
 * 用户账户表
 *
 *
 * ### 说明
 *
 * ```markdown
 * 1. 仅存放与账户权限相关的字段。
 * 2. 信息类字段放置于用户信息表中。
 * ```
 */
@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity {
  /**
   * 注册时间
   *
   *
   * ### 说明
   *
   * ```markdown
   * 1. 目前该字段的值会和 `createTime` 一致。
   * 2. 为保留扩展性，仍留下该字段。
   * ```
   */
  @Column({
    name: 'register_time',
    type: 'datetime',
    update: false,
    default: () => 'CURRENT_TIMESTAMP',
    comment: '注册时间',
  })
  registerTime: Date

  /** 微信小程序的  OpenID */
  @Column({
    type: 'varchar',
    length: 32,
    update: false,
    unique: true,
    comment: '微信小程序openid，用于唯一区分小程序用户',
  })
  openid: string

  /** 微信开放平台的 UnionID */
  @Column({
    type: 'varchar',
    length: 32,
    update: false,
    unique: true,
    default: '',
    comment: '用户在开放平台的唯一标识符',
  })
  unionid: string

  /** 账户手机号 */
  @Column({
    type: 'char',
    length: 11,
    default: '',
    comment: '账户手机号，可用于其他客户端登录',
  })
  phone: string
}
