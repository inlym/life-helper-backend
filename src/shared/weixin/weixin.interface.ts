/** 所有来自微信服务端的响应数据都继承这个接口 */
export interface BasicWeixinResponse {
  /** 错误码 */
  errcode?: number

  /** 错误信息 */
  errmsg?: string
}

/**
 * 登录凭证校验接口响应数据
 *
 * @see [官方文档](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html)
 */
export interface Code2SessionResponse extends BasicWeixinResponse {
  /** 用户唯一标识 */
  openid: string

  /** 会话密钥 */
  session_key: string

  /** 用户在开放平台的唯一标识符，若当前小程序已绑定到微信开放平台帐号下会返回 */
  unionid: string
}

/**
 * 获取小程序全局唯一后台接口调用凭据响应数据
 *
 * @see [官方文档](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/access-token/auth.getAccessToken.html)
 */
export interface GetAccessTokenResponse extends BasicWeixinResponse {
  /** 获取到的凭证 */
  access_token: string

  /** 凭证有效时间，单位：秒。目前是7200秒之内的值。 */
  expires_in: number
}

/**
 * 获取无数量限制的小程序码配置项
 *
 * @see [官方文档](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/qr-code/wxacode.getUnlimited.html)
 */
export interface GetUnlimitedConfig {
  /** 最大32个可见字符，只支持数字，大小写英文以及部分特殊字符 */
  scene: string

  /** 小程序路径，根路径前不要填加 `/` */
  page: string

  /** 二维码的宽度，单位 px，最小 280px，最大 1280px */
  width?: number

  /** 自动配置线条颜色，如果颜色依然是黑色，则说明不建议配置主色调，默认 false */
  auto_color?: boolean

  /** auto_color 为 false 时生效，使用 rgb 设置颜色 */
  line_color?: Record<'r' | 'g' | 'b', number>

  /** 是否需要透明底色，为 true 时，生成透明底色的小程序 */
  is_hyaline?: boolean
}
