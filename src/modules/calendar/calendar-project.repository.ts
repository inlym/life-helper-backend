import { EntityRepository, Repository } from 'typeorm'

import { CalendarProject } from './calendar-project.entity'

@EntityRepository(CalendarProject)
export class CalendarProjectRepository extends Repository<CalendarProject> {}
