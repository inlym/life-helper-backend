import { AbstractEntity } from 'src/common/abstract.entity'
import { Column, Entity, Generated } from 'typeorm'

/**
 * 备注：
 * 1. 当前表仅用于测试和调试，非正式项目内容
 */
@Entity('debug_item')
export class DebugItem extends AbstractEntity {
  @Column({
    name: 'user_id',
    type: 'int',
    comment: '所属用户 ID',
  })
  userId: number

  @Column({
    name: 'project_id',
    type: 'int',
    default: 0,
    comment: '所属项目 ID',
  })
  projectId: number

  @Column({
    type: 'varchar',
    length: 200,
    default: '',
    comment: '标题',
  })
  title: string

  @Column({
    type: 'varchar',
    length: 1000,
    default: '',
    comment: '内容',
  })
  content: string

  @Column()
  @Generated('uuid')
  uuid: string
}
