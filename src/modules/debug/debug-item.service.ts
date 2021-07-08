import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DebugItem } from './debug-item.entity'

@Injectable()
export class DebugItemService {
  constructor(
    @InjectRepository(DebugItem)
    private readonly debugItemRepository: Repository<DebugItem>
  ) {}
}
