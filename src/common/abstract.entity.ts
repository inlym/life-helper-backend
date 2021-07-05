import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn, VersionColumn } from 'typeorm'
import { Min } from 'class-validator'

/**
 * 当前实体包含所有公共列，所有实体继承当前实体
 */
export abstract class AbstractEntity {
  @PrimaryGeneratedColumn({
    comment: '主键 ID',
  })
  @Min(1)
  id: number

  /**
   * `createTime` 和 `updateTime` 两列的注意事项：
   * 1. 该两列由 MySQL 触发器自动维护，禁止在代码中手动更新。
   * 2. 不允许给该两列附加任务业务含义，即使值是完全相同的，例如当前情况下小程序用户的注册时间和列的创建时间是同一个值，也不能将创建时间赋予注册时间含义，必须再新增一列注册时间。
   * 3. 使用时就当该两列完全不存在，仅用于后续调试、复查 Bug 的用途。
   */
  @CreateDateColumn({
    name: 'create_time',
    select: false,
    update: false,
    insert: false,
    comment: '创建时间',
  })
  createTime: Date

  @UpdateDateColumn({
    name: 'update_time',
    select: false,
    update: false,
    insert: false,
    comment: '更新时间',
  })
  updateTime: Date

  @DeleteDateColumn({
    name: 'delete_time',
    select: false,
    update: false,
    insert: false,
    comment: '删除时间（软删标记）',
  })
  deleteTime: Date

  @VersionColumn({
    select: false,
    comment: '自动存储计数',
  })
  version: number
}
