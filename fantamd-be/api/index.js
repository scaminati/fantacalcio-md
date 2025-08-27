import { initFastify, getFastify } from '../src/server.js'

export default async function handler (req, res) {
  await initFastify()
  const app = getFastify()
  app.server.emit('request', req, res)
}
