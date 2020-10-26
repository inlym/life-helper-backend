'use strict'

module.exports = (app) => {
	const { router, controller } = app

	router.get('/ping', controller.ping.index)

	router.all('/debug', controller.debug.index)
}
