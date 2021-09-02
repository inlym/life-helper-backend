import { Logger } from '@nestjs/common'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

/** 日志工具 */
const logger = new Logger('HTTP')

/**
 * HTTP 请求客户端
 *
 *
 * ### 说明
 *
 * ```markdown
 * 1. 对外的 HTTP 请求均使用当前实例发起，用途是打印请求日志。
 * ```
 */
const instance = axios.create()

instance.interceptors.response.use((response) => {
  const status = response.status
  const url = response.config.baseURL ? response.config.baseURL : '' + instance.getUri(response.config)
  const method = response.config.method.toUpperCase()

  logger.log(`${status} ${method} ${url}`)

  return response
})

export function request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  return instance.request<T>(config)
}
