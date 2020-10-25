'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
	const { router, controller } = app
	router.all('/debug', controller.debug.index)
	router.get('/seq', controller.debug.seq)
}
