import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm'
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

  @VersionColumn({
    name: 'update_counter',
    comment: '自动存储计数',
  })
  updateCounter: number
}
