'use strict'

module.exports = {
	name: 'lhb-local',
	script: 'app.js',
	cwd: __dirname,
	exec_mode: 'cluster',
	instances: 0,
	out_file: './log/out.log',
	error_file: './log/err.log',
	combine_logs: true,
	env: {
		PORT: 3010,
		NODE_ENV: 'development',
	},
}
