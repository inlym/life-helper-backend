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
  adcode: string | number
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
  /**
   * 状态码，0为正常,
   * 310 - 请求参数信息有误
   * 311 - Key格式错误
   * 306 - 请求有护持信息请检查字符串
   * 110 - 请求来源未被授权
   */
  status: number

  /** 对 status 的描述 */
  message: string

  /** IP定位结果 */
  result: LocateIpResult
}

/** ═════════════════ 逆地址解析接口 ═════════════════ */

/** 结合知名地点形成的描述性地址，更具人性化特点 */
export interface FormattedAddresses {
  /** 推荐使用的地址描述，描述精确性较高 */
  recommend: string

  /** 粗略位置描述 */
  rough: string
}

/** 地址部件，address不满足需求时可自行拼接 */
export interface AddressComponent {
  /** 国家 */
  nation: string

  /** 省 */
  province: string

  /** 市 */
  city: string

  /** 区，可能为空字串 */
  district?: string

  /** 街道，可能为空字串 */
  street?: string

  /** 门牌，可能为空字串 */
  street_number?: string
}

/** 逆地址解析结果 */
export interface GeoLocationCoderResult {
  /** 以行政区划+道路+门牌号等信息组成的标准格式化地址 */
  address: string

  /** 结合知名地点形成的描述性地址，更具人性化特点 */
  formatted_addresses: FormattedAddresses

  /** 地址部件，address不满足需求时可自行拼接 */
  address_component: AddressComponent

  /** 行政区划信息 */
  ad_info: AddressInfo
}

/** 逆地址解析接口调用响应数据 */
export interface GeoLocationCoderResponse {
  /** 状态码，0为正常，其它为异常 */
  status: number

  /** 状态说明 */
  message: string

  /** 本次请求的唯一标识 */
  request_id: string

  /** 逆地址解析结果 */
  result: GeoLocationCoderResult
}

/** ═════════════════ getCoorByIp ═════════════════ */

/** 经纬度坐标 */
export interface LocationCoordinate {
  /** 经度 */
  longitude: number

  /** 纬度 */
  latitude: number
}
