import { Entity, Column } from 'typeorm'
import { BaseEntity } from 'src/common/base.entity'

@Entity()
export class CalendarProject extends BaseEntity {
  @Column({
    name: 'user_id',
    type: 'int',
    comment: '所属人用户 ID',
  })
  userId: number

  @Column({
    type: 'varchar',
    length: 32,
    update: false,
    unique: true,
    comment: '项目名称',
  })
  name: string
}
