import { SystemStatus } from './system.model'

/** ────────────────────  getStatus  ──────────────────── */

/** 查看系统运行状态 - 响应数据 */
export class GetStatusResponseDto extends SystemStatus {}

/** ────────────────────  pingRedis  ──────────────────── */

/** 查看 Redis 运行状态 - 响应数据 */
export class PingRedisResponseDto {
  /** Redis 被检测的次数 */
  counter: number
}
