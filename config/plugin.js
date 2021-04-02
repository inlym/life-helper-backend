'use strict'

module.exports = {
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },

  redis: {
    enable: true,
    package: 'egg-redis',
  },

  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },

  /** 阿里云 Node.js 性能平台 */
  alinode: {
    enable: true,
    package: 'egg-alinode',
    env: ['prod'],
  },

  validate: {
    enable: true,
    package: 'egg-parameter',
  },

  tablestore: {
    enable: true,
    package: 'egg-aliyun-tablestore',
  },

  load: {
    enable: true,
    package: 'egg-load',
  },

  tracer: {
    enable: true,
    package: 'egg-apigw-tracer',
  },

  kit: {
    enable: true,
    package: 'egg-kit',
  },

  oss: {
    enable: true,
    package: 'egg-oss',
  },
}
