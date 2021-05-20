import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn, VersionColumn } from 'typeorm'
import { Min } from 'class-validator'

/**
 * 当前实体包含所有公共列，所有实体继承当前实体
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn({
    comment: '主键 ID',
  })
  @Min(1)
  id: number

  @CreateDateColumn({
    name: 'create_time',
    comment: '创建时间',
  })
  createTime: Date

  @UpdateDateColumn({
    name: 'update_time',
    comment: '更新时间',
  })
  updateTime: Date

  @DeleteDateColumn({
    name: 'delete_time',
    comment: '删除时间（软删标记）',
  })
  deleteTime: Date

  @VersionColumn({
    comment: '自动存储计数',
  })
  version: number
}
