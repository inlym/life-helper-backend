export class SystemStatus {
  env: {
    NODE_ENV?: string
    PORT?: string
    PWD?: string
  }

  os: {
    totalMemory: string
    freeMemory: string
    hostname: string
    loadavg: number[]
  }

  process: {
    cpuUsage: NodeJS.CpuUsage
    cwd: string
    pid: number
    ppid: number
    platform: NodeJS.Platform
    version: string
    uptime: string
  }

  config: {
    port: number
    proxyNumber: number
  }

  timestamp: number

  UTC: string
}
