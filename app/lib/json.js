import electron from 'electron'
import https from 'https'
import http from 'http'
const app = electron.app || electron.remote.app

export default (options_) => {
  const options = Object.assign({}, options_, {
    headers: {
      'User-Agent': `ZazuApp v${app.getVersion()}`,
    },
  })
  return new Promise((resolve, reject) => {
    const library = options_.https ? https : http
    library
      .get(options, (result) => {
        var chunks = []
        result.on('data', (chunk) => {
          chunks.push(chunk.toString())
        })
        result.on('end', () => {
          resolve(JSON.parse(chunks.join('')))
        })
        result.on('error', (error) => {
          reject(error)
        })
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}
