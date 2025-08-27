import {initFastify, getFastify} from '../src/app.js'

await initFastify()

export default async function handler (req, res) {
  const app = getFastify()
  app.server.emit('request', req, res)
}
