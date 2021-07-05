import { Entity, Column } from 'typeorm'
import { AbstractEntity } from 'src/common/abstract.entity'

/**
 * 任务表
 */
@Entity('calendar_task')
export class CalendarTask extends AbstractEntity {
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
    name: 'start_time',
    type: 'datetime',
    nullable: true,
    comment: '任务开始时间',
  })
  startTime: Date

  @Column({
    name: 'due_time',
    type: 'datetime',
    nullable: true,
    comment: '任务到期时间',
  })
  dueTime: Date

  @Column({
    name: 'time_type',
    type: 'tinyint',
    default: 0,
    comment: '任务时间类型：0-未设置，1-时间段，2-整天',
  })
  timeType: number

  @Column({
    name: 'is_compulete',
    type: 'tinyint',
    default: false,
    comment: '是否已完成',
  })
  isCompleted: boolean

  @Column({
    name: 'complete_time',
    type: 'datetime',
    nullable: true,
    comment: '完成时间',
  })
  completeTime: Date
}
