import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DebugProject } from './debug-project.entity'

@Injectable()
export class DebugProjectService {
  private readonly logger = new Logger(DebugProjectService.name)

  constructor(
    @InjectRepository(DebugProject)
    private readonly debugProjectRepository: Repository<DebugProject>
  ) {}

  mockCreate(): Promise<DebugProject> {
    const project = this.debugProjectRepository.create({
      userId: 1,
      name: '我是名称',
      description: '我是描述',
    })

    project.tag = ['one', 'two']

    return this.debugProjectRepository.save(project)
  }

  getAll(userId: number): Promise<DebugProject[]> {
    return this.debugProjectRepository.find({
      select: ['id', 'name'],
      where: { userId },
      order: { id: 'DESC' },
    })
  }

  async getOne(userId: number, id: number): Promise<DebugProject> {
    const project = await this.debugProjectRepository.findOne(id)

    if (!project) {
      // 未找到情况为 `undefined`
      throw new HttpException({ message: 'project 不存在' }, HttpStatus.NOT_FOUND)
    }

    if (project.userId !== userId) {
      throw new HttpException({ message: 'project 存在，但是不属于当前用户' }, HttpStatus.UNAUTHORIZED)
    }

    return project
  }
}
