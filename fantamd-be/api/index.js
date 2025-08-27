const initFastify = require('../server.js')
const app = initFastify()

export default async function handler (req, res) {
  await app.ready()
  app.server.emit('request', req, res)
}
