export interface code2SessionInterface {
  openid: string
  session_key: string
  unionid: string
}

export interface fetchAccessTokenInterface {
  access_token: string
  expires_in: number
}
