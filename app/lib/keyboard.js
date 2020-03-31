const Mousetrap = require('mousetrap')

const events = {}
const self = {
  emit: key => {
    if (!events[key]) return
    events[key].forEach(object => object.cb())
  },

  unbind: namespace => {
    Object.keys(events).forEach(key => {
      events[key].forEach((element, i) => {
        if (element.namespace === namespace) {
          events[key].splice(i, 1)
        }
      })
    })
  },

  bind: (namespace, keys, callback) => {
    const keysArray = typeof keys === 'string' ? [keys] : keys
    keysArray.forEach(key => {
      if (!events[key]) {
        events[key] = []
        Mousetrap.bind(key, () => {
          self.emit(key)
        })
      }
      events[key].push({ cb: callback, namespace })
    })
  },
}

module.exports = self
