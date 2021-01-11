'use strict'

module.exports = (app) => {
  app.redis.set('system:launch_time', app.now())
  app.redis.incr('system:launch_counter')

  app.once('server', () => {
    app.logger.info(`[APP ON SERVER] EGG_SERVER_ENV => ${process.env.EGG_SERVER_ENV}`)
    app.logger.info(`[APP ON SERVER] NODE_ENV => ${process.env.NODE_ENV}`)
    app.logger.info(`[APP ON SERVER] app.config.env => ${app.config.env}`)
  })

  app.on('error', (err, ctx) => {
    ctx.logger.error(`[app on error] error => ${err}`)
  })
}
