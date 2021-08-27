import { Logger } from '@nestjs/common'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

const logger = new Logger('HTTP')

const instance = axios.create()
instance.interceptors.response.use((response) => {
  const status = response.status
  const url = response.config.baseURL + instance.getUri(response.config)
  const method = response.config.method.toUpperCase()

  logger.log(`${status} ${method} ${url}`)

  return response
})

export function request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  return instance.request<T>(config)
}
