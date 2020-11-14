'use strict'

const { app } = require('egg-mock/bootstrap')

describe('controller/ping.test.js', () => {
  describe('GET /ping', () => {
    it('status => 200, body => "ok"', () => {
      return app.httpRequest().get('/ping').expect(200, 'ok')
    })
  })

  describe('GET /ping/redis', () => {
    it('status => 200, body => "ok"', async () => {
      return app.httpRequest().get('/ping/redis').expect(200, 'ok')
    })
  })

  describe('GET /ping/mysql', () => {
    it('status => 200, body => "ok"', async () => {
      return app.httpRequest().get('/ping/mysql').expect(200, 'ok')
    })
  })

  describe('GET /ping/ots', () => {
    it('status => 200, body => "ok"', async () => {
      return app.httpRequest().get('/ping/ots').expect(200, 'ok')
    })
  })
})
