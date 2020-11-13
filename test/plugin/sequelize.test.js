'use strict'

const { app, assert } = require('egg-mock/bootstrap')

describe('egg-sequelize', () => {
  it('aaaaaaaaaa', async () => {
    console.info(app.sequelize)
    const res = await app.model.query('select database() as db;')
    console.info(`res => ${JSON.stringify(res)}`)
    assert(res[0][0]['db'] === 'life_helper_db_test')
  })
})
