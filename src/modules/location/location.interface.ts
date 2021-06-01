// lbsqq.service

interface Location {
  lat: number
  lng: number
}

interface AdInfo {
  nation: string
  province: string
  city?: string
  district?: string
  adcode: string
}

export interface IpLocationResult {
  ip: string
  location: Location
  ad_info: AdInfo
}

interface FormattedAddresses {
  recommend: string
  rough: string
}

// 字段很多，目前仅记录用到的字段
export interface GeoLocationCoderResult {
  address: string
  formatted_addresses: FormattedAddresses
  ad_info: AdInfo
}

// location.service
export interface LocationInfo {
  longitude: number
  latitude: number
  nation: string
  province: string
  city?: string
  district?: string
  adcode: string
}
