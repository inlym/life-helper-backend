import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { PORT, PROXY_NUMBER } from 'life-helper-config'
import * as os from 'os'

@Injectable()
export class SystemService {
  /**
   * 调试时，需要查看的请求的属性值
   */
  get detectedKeys(): string[] {
    const keys: string[] = [
      'method',
      'url',
      'path',
      'baseUrl',
      'originalUrl',
      'headers',
      'params',
      'query',
      'body',
      'ip',
      'ips',
      'cookies',
      'hostname',
      'subdomains',
    ]

    return keys
  }

  /**
   * 挑选部分请求的属性组成新的对象
   *
   * @param request Express 中的请求对象
   */
  pickRequestProperties(request: Request) {
    return this.detectedKeys.reduce((result: Record<string, any>, key: string) => {
      result[key] = request[key]
      return result
    }, {} as Record<string, any>)
  }

  /**
   * 查看系统运行状态和参数
   *
   *
   * @description
   *
   * ```markdown
   * [config] - 自定义配置项
   * 1. `port` - 监听端口
   * 2. `proxyNumber` - 反向代理数量
   * ```
   */
  getSystemStatus() {
    const env = {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      PWD: process.env.PWD,
    }

    const osInfo = {
      totalMemory: (os.totalmem() / 1024 ** 3).toFixed(2) + 'GB',
      freeMemory: (os.freemem() / 1024 ** 3).toFixed(2) + 'GB',
      hostname: os.hostname(),
      loadavg: os.loadavg(),
    }

    const processInfo = {
      /** 当前进程的用户和系统 CPU 时间使用情况 */
      cpuUsage: process.cpuUsage(),

      /** Node.js 进程的当前工作目录 */
      cwd: process.cwd(),

      /** 当前进程的 PID */
      pid: process.pid,

      /** 当前进程的父进程的 PID */
      ppid: process.ppid,

      /** 当前操作系统平台的字符串 */
      platform: process.platform,

      /** Node.js 版本字符串   */
      version: process.version,

      /** 当前 Node.js 进程已经运行的秒数 */
      uptime: process.uptime().toFixed(0) + ' 秒',
    }

    /** 配置项内容 */
    const config = {
      port: PORT,
      proxyNumber: PROXY_NUMBER,
    }

    const timestamp = Date.now()
    const UTC = new Date().toISOString()

    return { env, os: osInfo, process: processInfo, config, timestamp, UTC }
  }
}
