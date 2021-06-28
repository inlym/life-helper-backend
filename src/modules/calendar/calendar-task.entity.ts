import { Entity, Column } from 'typeorm'
import { BaseEntity } from 'src/common/base.entity'

/**
 * 任务表
 */
@Entity()
export class CalendarTask extends BaseEntity {
  @Column({
    name: 'project_id',
    type: 'int',
    default: 0,
    comment: '所属项目 ID',
  })
  projectId: number

  @Column({
    type: 'varchar',
    length: 32,
    default: '',
    comment: '任务标题',
  })
  title: string

  @Column({
    type: 'varchar',
    length: 1000,
    default: '',
    comment: '任务内容',
  })
  content: string

  @Column({
    type: 'datetime',
    nullable: true,
    comment: '任务开始时间',
  })
  startTime: Date

  @Column({
    type: 'datetime',
    nullable: true,
    comment: '任务到期时间',
  })
  dueDate: Date

  @Column({
    type: 'tinyint',
    default: 0,
    comment: '任务时间类型：0-未设置，1-时间段，2-整天',
  })
  timeType: number
}
