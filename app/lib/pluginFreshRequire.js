const path = require('path')

module.exports = (pluginPath) => {
  const pluginName = path.basename(pluginPath)
  Object.keys(require.cache).forEach((file) => {
    if (file.includes(pluginName)) {
      delete require.cache[file]
    }
  })
}
