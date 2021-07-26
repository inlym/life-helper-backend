/** ═════════════════ IP 定位接口 ═════════════════ */

/** 经纬度坐标 */
export interface Location {
  /** 经度 */
  lng: number

  /** 纬度 */
  lat: number
}

/** 定位行政区划信息 */
export interface AddressInfo {
  /** 国家 */
  nation: string

  /** 省 */
  province: string

  /** 市 */
  city?: string

  /** 区 */
  district?: string

  /** 行政区划代码 */
  adcode: number
}

/** IP定位结果 */
export interface LocateIpResult {
  /** 用于定位的IP地址 */
  ip: string

  /** 定位坐标 */
  location: Location

  /** 定位行政区划信息 */
  ad_info: AddressInfo
}

/**
 * IP 定位 API 响应数据
 */
export interface LocateIpResponse {
  status: number
  message: string
  result: LocateIpResult
}

/** ═════════════════ XX 接口 ═════════════════ */
