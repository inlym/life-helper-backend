'use strict'

/**
 * 配置项文档：
 * @see https://eggjs.org/zh-cn/basics/config.html
 */

module.exports = {
  /**
   * 配置项顺序：
   * 1. 框架本身配置项
   * 2. 框架内置插件配置
   * 3. 第三方插件配置
   * 4. 中间件配置
   * 5. 资源实例类配置（MySQL、Redis 等）
   * 6. 第三方资源配置（阿里云市场 APPCODE 等）
   */

  /**
   * 应用启动配置项
   * @see https://eggjs.org/zh-cn/core/deployment.html#启动配置项
   */
  cluster: {
    listen: {
      port: 3010,
      hostname: '127.0.0.1',
    },
  },

  /**
   * 前置代理模式配置项
   * @see https://eggjs.org/zh-cn/tutorials/proxy.html
   */

  /** 是否开启前置代理模式 */
  proxy: true,

  /** 前置反向代理数量 */
  maxIpsCount: 1,

  /**
   * 框架内置安全插件 egg-security 配置
   * @see https://eggjs.org/zh-cn/core/security.html
   */
  security: {
    csrf: {
      enable: false,
    },
  },

  /**
   * 框架内置国际化支持插件 egg-i18n 配置
   * @see https://eggjs.org/zh-cn/core/i18n.html
   */
  i18n: {
    enable: false,
  },

  /**
   * 框架内置模板渲染插件 egg-view 配置
   * @see https://eggjs.org/zh-cn/core/view.html
   */
  view: {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.njk': 'nunjucks',
    },
  },

  /**
   * 第三方插件 egg-apigw-tracer 配置
   * @see https://www.npmjs.com/package/egg-apigw-tracer
   */
  tracer: {
    mode: 'uuid',
  },

  /** 第三方插件 egg-load 配置 */
  load: {
    module: ['axios', 'dayjs', 'only', 'only2'],
  },

  /** 启用的中间件 */
  middleware: ['requestLog', 'auth'],

  /** 请求响应记录日志中间件 */
  requestLog: {
    enable: true,
    ignore: '/ping',
  },

  /** 免鉴权路径，访问接口无需 token */
  noAuthPath: ['/debug', '/debug/temp', '/login', '/ping', '/status', '/wxserver/message', '/oss/callback', '/callback'],

  /**
   * --------------------------------------------------------------------------
   * 以下配置项，请替换成自己的资源内容
   */

  /**
   * Sequelize 实例配置
   * @see https://eggjs.org/zh-cn/tutorials/sequelize.html
   */
  sequelize: {
    dialect: 'mysql',
    host: 'xxxxxxxxxxxx',
    port: 3306,
    username: 'xxxxxxxxxxxx',
    password: 'xxxxxxxxxxxx',
    database: 'xxxxxxxxxxxx',
    timezone: '+08:00',
  },

  /**
   * Redis 实例配置
   * @see https://www.npmjs.com/package/egg-redis
   */
  redis: {
    client: {
      host: 'xxxxxxxxxxxx',
      port: 6379,
      password: 'xxxxxxxxxxxx',
      db: 8,
    },
  },

  /**
   * 阿里云表格存储(TableStore)实例配置
   * @see https://www.npmjs.com/package/egg-aliyun-tablestore
   */
  tablestore: {
    client: {
      accessKeyId: 'xxxxxxxxxxxx',
      accessKeySecret: 'xxxxxxxxxxxx',
      endpoint: 'xxxxxxxxxxxx',
      instancename: 'xxxxxxxxxxxx',
    },
    app: true,
    agent: false,
  },

  /** 阿里云 Node.js 性能平台 */
  alinode: {
    server: 'xxxxxxxxxxxx',
    appid: 'xxxxxxxxxxxx',
    secret: 'xxxxxxxxxxxx',
    logdir: 'xxxxxxxxxxxx',
  },

  /**
   * 阿里云 OSS
   * @see https://help.aliyun.com/document_detail/64097.html
   */
  oss: {
    clients: {
      /**
       * 专用于存储由用户侧上传的图片的 Bucket
       * 1. baseURL => https://image.lh.inlym.com
       * 2. 当前 Bucket 不分文件夹，所有文件均放置于根目录下
       * 3. 文件名为去掉短横线的 32 位字符 UUID
       * 4. 在存储图片地址时，只存储文件名，不存储 baseURL
       */
      image: {
        bucket: 'xxxxxxxxxxxx',
        accessKeyId: 'xxxxxxxxxxxx',
        accessKeySecret: 'xxxxxxxxxxxx',
      },
    },

    /** 所有 OSS 实例共享的配置项 */
    default: {
      endpoint: 'oss-cn-hangzhou-internal.aliyuncs.com',
      region: 'oss-cn-hangzhou',
      internal: true,
    },
  },

  /** 小程序开发者ID */
  miniprogram: {
    /** 小程序 appId */
    appid: 'xxxxxxxxxxxx',

    /** 小程序 appSecret */
    secret: 'xxxxxxxxxxxx',
  },

  /** 返回给前端使用的域名 */
  domain: {
    /** 统一 API 请求地址 */
    api: 'https://api.lh.inlym.com',

    /** 由官方内置的图片的 OSS 地址 */
    ossImageOfficial: 'https://img.lh.inlym.com',

    /** 用户上传图片用途的 OSS 地址 */
    ossImageUgc: 'https://image.lh.inlym.com',
  },

  /**
   * 阿里云市场 - IP归属地查询 - APPCODE
   * @see https://market.aliyun.com/products/57002002/cmapi00035184.html
   */
  APPCODE_IPLOCATION: 'xxxxxxxxxxxx',

  /**
   * 阿里云市场 - 墨迹天气（专业版经纬度） - APPCODE
   * @see https://market.aliyun.com/products/57096001/cmapi012364.html
   */
  APPCODE_MOJI: 'xxxxxxxxxxxx',

  /**
   * 阿里云市场 - 墨迹天气（专业版CityID） - APPCODE
   * @see https://market.aliyun.com/products/57096001/cmapi013828.html
   */
  APPCODE_MOJI2: 'xxxxxxxxxxxx',

  /**
   * 腾讯位置服务 WebService API 开发者密钥（Key）
   * @see https://lbs.qq.com/service/webService/webServiceGuide/webServiceOverview
   *
   * 这里实际上只需要一个 key，使用列表的原因是：
   * 该 API 对于个人开发者的免费配额较低，准备多注册几个帐号轮询调用。
   */
  TENCENT_LBS_KEYS: ['xxxxxxxxxxxx'],

  /**
   * 和风天气开发平台密钥（key）
   * @see https://dev.qweather.com/docs/start/get-key/
   */
  QWEATHER: {
    basic: {
      baseURL: 'https://devapi.qweather.com/v7/',
      key: 'xxxxxxxxxxxx',
    },
    pro: {
      baseURL: 'https://api.qweather.com/v7/',
      key: 'xxxxxxxxxxxx',
    },
  },
}
