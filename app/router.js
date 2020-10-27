'use strict'

module.exports = (app) => {
	const { router, controller } = app

	router.get('/ping', controller.ping.index)
	router.get('/ping/redis', controller.ping.redis)

	router.all('/debug', controller.debug.index)

	router.get('/ip', controller.ip.index)
}
