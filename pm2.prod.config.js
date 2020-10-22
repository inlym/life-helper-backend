'use strict'

module.exports = {
	name: 'lhb-prod',
	script: 'app.js',
	cwd: __dirname,
	exec_mode: 'cluster',
	instances: 0,
	out_file: './log/out.log',
	error_file: './log/err.log',
	combine_logs: true,
	env: {
		PORT: 3030,
		NODE_ENV: 'production',
	},
}
