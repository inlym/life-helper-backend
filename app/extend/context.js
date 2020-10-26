'use strict'

module.exports = {
	get tracer() {
		const origin = this.get('x-ca-request-id')
		const arr = origin.split(',')
		const traceId = arr[arr.length - 1].replace(' ', '')
		return {
			traceId,
		}
	},
}
