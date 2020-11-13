'use strict'

module.exports = (app) => {
  app.once('server', (server) => {
    app.logger.info(`HTTP server 已启动, server => ${JSON.stringify(server)}`)
    app.logger.info(`EGG_SERVER_ENV => ${process.env.EGG_SERVER_ENV}`)
    app.logger.info(`NODE_ENV => ${process.env.NODE_ENV}`)
    app.logger.info(`app.config.env => ${app.config.env}`)
  })

  app.on('error', (err, ctx) => {
    ctx.logger.error(`[app on error] error => ${err}`)
  })

  app.on('request', (ctx) => {})

  app.on('response', (ctx) => {})
}
