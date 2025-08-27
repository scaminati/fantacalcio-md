const { initFastify } = require('../server.js')
const app = initFastify()

module.exports = async function handler (req, res) {
  await app.ready()
  app.server.emit('request', req, res)
}
