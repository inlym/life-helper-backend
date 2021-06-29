import { Entity, Column } from 'typeorm'
import { AbstractEntity } from 'src/common/abstract.entity'

@Entity()
export class CalendarProject extends AbstractEntity {
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
    comment: '项目名称',
  })
  name: string
}
