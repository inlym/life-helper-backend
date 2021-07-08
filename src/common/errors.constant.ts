/**
 * 返回响应的错误状态码
 */

/**
 * API 调用者可能的来源：
 * 1. 官方应用程序
 * 2. 第三方调用者（攻击者）：攻击者可能通过抓包等方式获取接口的调用方式，进行自行调用。
 */

/**
 * 错误处理策略：
 *
 * --- 业务层面错误 ---
 * - 【普通界面操作是否可能触发】：是
 * - 【常见触发原因】：由于页面停留导致状态变更未同步，用户进行了当前状态不允许的操作。
 * - 【案例】：给已超时失效的订单付款等
 * - 【处理策略】：向用户给出明确的错误提示以及操作建议（使用标准的产品文案）
 *
 * --- 内部错误 ---
 * - 【普通界面操作是否可能触发】：与用户无关
 * - 【常见触发原因】：配置出错，依赖的第三方服务出错
 * - 【案例】：向第三方购买的资源包用完了
 * - 【处理策略】：不告知真实错误原因，仅给出模糊性的毫无意义的提示
 *
 * --- 接口调用错误 ---
 * - 【普通界面操作是否可能触发】：客户端开发测试通过后，触发概率较低
 * - 【常见触发原因】：由攻击者自行枚举调用 API
 * - 【案例】：向第三方购买的资源包用完了
 * - 【处理策略】：不告知真实错误原因，仅给出模糊性的毫无意义的提示
 */

/**
 * 提示类型
 */
enum Prompt {
  /** 不需要提示 */
  None = 0,

  /**
   * Toast 类型
   */
  Toast_None = 101,

  /**
   * Modal 类型
   */

  /**
   * 单个按钮，按钮文案：【我知道了】
   */
  Modal_SingleButton = 201,
}

const COMMON_MESSAGE_1 = '当前网络环境较差，请重新连接网络后再继续操作！'
const NOT_FOUNT_MESSAGE_1 = '你访问的资源不存在！'

export const ERRORS = {
  /** 请求成功 */
  SUCCESS: { code: 0 },

  /**
   * `4xxxx` 系列表示权限相关错误
   */

  /** 无效的 `code` */
  INVILID_CODE: { code: 40001, message: COMMON_MESSAGE_1, prompt: Prompt.Modal_SingleButton },

  /** 无效的 `token` */
  INVILID_TOKEN: { code: 40002 },

  /** 小程序登录失败 */
  MP_LOGIN_FAIL: { message: COMMON_MESSAGE_1, prompt: Prompt.Modal_SingleButton },

  /** 需要鉴权的接口，未提供 `token` 等鉴权信息 */
  UNAUTHORIZED_ACCESS: { message: COMMON_MESSAGE_1, prompt: Prompt.Modal_SingleButton },

  /** 资源未找到 */
  RESOURCE_NOT_FOUND: { message: NOT_FOUNT_MESSAGE_1, prompt: Prompt.Toast_None },

  /** 资源找到，但是不属于当前账户 */
  RESOURCE_UNAUTHORIZED: { message: NOT_FOUNT_MESSAGE_1, prompt: Prompt.Toast_None },

  /**
   * 纯服务器内部错误，或者服务器与第三方服务交互错误，与接口调用参数无关
   * (所有未知错误都使用该提示)
   */
  COMMON_SERVER_ERROR: { message: '服务器开了个小差，请稍后重新操作！', prompt: Prompt.Modal_SingleButton },
}
