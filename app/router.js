'use strict'

module.exports = (app) => {
	const { router, controller } = app

	router.get('/ping', controller.ping.index)
	router.get('/ping/redis', controller.ping.redis)
	router.get('/ping/mysql', controller.ping.mysql)

	router.all('/debug', controller.debug.index)
	router.get('/debug/logger', controller.debug.logger)

	router.get('/ip', controller.ip.index)
}
