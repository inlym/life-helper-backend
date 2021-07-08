import { AbstractEntity } from 'src/common/abstract.entity'
import { Column, Entity } from 'typeorm'

/**
 * 备注：
 * 1. 当前表仅用于测试和调试，非正式项目内容
 */

@Entity('debug_project')
export class DebugProject extends AbstractEntity {
  @Column({
    name: 'user_id',
    type: 'int',
    comment: '所属用户 ID',
  })
  userId: number

  @Column({
    type: 'varchar',
    length: 32,
    default: '',
    comment: '项目名称',
  })
  name: string

  @Column({
    type: 'varchar',
    length: 300,
    default: '',
    comment: '项目描述',
  })
  description: string

  @Column({
    type: 'simple-array',
    comment: '标签',
  })
  tag: string[]
}
