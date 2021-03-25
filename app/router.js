'use strict'

module.exports = (app) => {
  require('./router/debug.js')(app)
  require('./router/ping.js')(app)
  require('./router/login.js')(app)
  require('./router/user.js')(app)
  require('./router/weather.js')(app)
  require('./router/location.js')(app)
  require('./router/image.js')(app)
  require('./router/wxserver.js')(app)
  require('./router/oss.js')(app)
}
