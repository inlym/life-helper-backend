import { EntityRepository, Repository } from 'typeorm'

import { CalendarTask } from './calendar-task.entity'

@EntityRepository(CalendarTask)
export class CalendarTaskRepository extends Repository<CalendarTask> {}
