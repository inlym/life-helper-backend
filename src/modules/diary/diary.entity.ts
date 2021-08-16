import { AbstractEntity } from 'src/common/abstract.entity'
import { Column, Entity } from 'typeorm'

/**
 * 生活记录 - 主表
 */
@Entity('diary')
export class Diary extends AbstractEntity {
  @Column({
    name: 'user_id',
    type: 'int',
    comment: '所属用户 ID',
  })
  userId: number

  @Column({
    type: 'varchar',
    default: '',
    comment: '内容文本',
  })
  content: string

  @Column({
    type: 'simple-array',
    comment: '照片列表',
  })
  images: string[]

  @Column({
    type: 'simple-array',
    comment: '视频列表',
  })
  videos: string[]

  @Column({
    name: 'place_id',
    type: 'int',
    default: 0,
    comment: '定位地点 ID',
  })
  placeId: number
}
