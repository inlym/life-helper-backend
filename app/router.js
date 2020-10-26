'use strict'

module.exports = (app) => {
	const { router, controller } = app

	router.get('/ping', controller.ping.index)

	router.all('/debug', controller.debug.index)
	router.get('/debug/redirect', controller.debug.redirect)
	router.get('/temp', controller.debug.temp)
	router.get('/seq', controller.debug.seq)
}
