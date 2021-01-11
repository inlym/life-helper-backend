'use strict'

const { Service } = require('egg')

/** 系统相关服务 */
class SystemService extends Service {
  /** 查看系统运行状态信息 */
  async status() {
    const {
      /** 操作系统的 CPU 架构 */
      arch,

      /** 调试器使用的端口 */
      debugPort,

      /** 进程的 PID */
      pid,

      /** 当前进程的父进程的 PID */
      ppid,

      /** 操作系统平台 */
      platform,

      /** Node.js 版本字符串,例如 v14.8.0 */
      version,
    } = process

    const {
      /** 应用名称 */
      name,

      /** env 环境 */
      env,

      /** 应用代码的目录 */
      baseDir,
    } = this.app.config

    const { EGG_SERVER_ENV, NODE_ENV } = process.env

    /** 监听端口 */
    const listenPort = this.app.config.cluster.listen.port

    const launchTime = await this.app.redis.get('system:launch_time')
    const launchCounter = await this.app.redis.get('system:launch_counter')

    /** 当前时间 */
    const currentTime = this.app.now()

    return {
      arch,
      debugPort,
      pid,
      ppid,
      platform,
      version,
      name,
      env,
      baseDir,
      listenPort,
      EGG_SERVER_ENV,
      NODE_ENV,
      launchTime,
      launchCounter,
      currentTime,
    }
  }
}

module.exports = SystemService