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
