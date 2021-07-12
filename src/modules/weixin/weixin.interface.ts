export interface code2SessionInterface {
  openid: string
  session_key: string
  unionid: string
}

export interface FetchAccessTokenResult {
  access_token: string
  expires_in: number
  errcode?: number
  errmsg?: string
}

/**
 * @see https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/qr-code/wxacode.getUnlimited.html
 */
export interface GetUnlimitedOptions {
  scene: string
  page: string
  width?: number
  auto_color?: boolean
}
