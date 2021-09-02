import { Min } from 'class-validator'
import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm'

/**
 * 基实体
 *
 *
 * ### 说明
 *
 * ```markdown
 * 1. 当前实体包含了所有实体都会用到的一些公共列。
 * 2. 所有实体都应当继承当前的基实体，避免重复定义这些公共列。
 * ```
 */
export abstract class AbstractEntity {
  /** 主键 ID */
  @PrimaryGeneratedColumn({
    comment: '主键 ID',
  })
  @Min(1)
  id: number

  /**
   * 创建时间
   *
   *
   * ### 说明
   *
   * ```markdown
   * 1. `创建时间` 列由 MySQL 触发器自动维护，禁止在代码中手动更新。
   * ```
   */
  @CreateDateColumn({
    name: 'create_time',
    select: false,
    update: false,
    insert: false,
    comment: '创建时间',
  })
  createTime: Date

  /**
   * 更新时间
   *
   *
   * ### 说明
   *
   * ```markdown
   * 1. `更新时间` 列由 MySQL 触发器自动维护，禁止在代码中手动更新。
   * ```
   */
  @UpdateDateColumn({
    name: 'update_time',
    select: false,
    update: false,
    insert: false,
    comment: '更新时间',
  })
  updateTime: Date

  /**
   * 删除时间（软删标记）
   *
   *
   * ### 说明
   *
   * ```markdown
   * 1. 当前列由框架自动维护，禁止在代码中手动更新。
   * ```
   */
  @DeleteDateColumn({
    name: 'delete_time',
    select: false,
    update: false,
    insert: false,
    comment: '删除时间（软删标记）',
  })
  deleteTime: Date

  /**
   * 自动存储计数（更新次数）
   *
   *
   * ### 说明
   *
   * ```markdown
   * 1. 当前列由框架自动维护，禁止在代码中手动更新。
   * ```
   */
  @VersionColumn({
    select: false,
    comment: '自动存储计数（更新次数）',
  })
  version: number
}
