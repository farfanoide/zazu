const { execFile, execFileSync } = require('child_process')
const which = require('which')
const retry = require('./retry')
const installStatus = require('./installStatus')
const jetpack = require('fs-jetpack')
const mkdirp = require('mkdirp')
const path = require('path')

const git = (arguments_, options) => {
  return new Promise((resolve, reject) => {
    execFile(gitPath(), arguments_, options || {}, (error) => {
      error ? reject(error) : resolve()
    })
  })
}

const gitSync = (arguments_) => {
  try {
    return execFileSync(gitPath(), arguments_).toString()
  } catch (error) {
    return false
  }
}

const pull = (name, packagePath) => {
  return git(['pull'], { cwd: packagePath }).catch((error) => {
    if (error.message.match(/enoent/i)) {
      throw new Error('Package "' + name + '" is not cloned')
    } else {
      throw error
    }
  })
}

/**
 * Checks the status to see what work needs to be done. If the status is
 * `cloned` it succesfully cloned the repo, but didn't `npm install`. If the
 * status is `installed` there is no more work to do. If no status exists, we
 * clone the repo.
 *
 * Failures will `retry` the clone.
 *
 * DUPLICATE COMMENT FOR: github.install
 */
const clone = (name, packagePath) => {
  return installStatus.get(name).then((status) => {
    if (status && jetpack.exists(packagePath)) return status
    return retry(
      `git clone [${name}]`,
      () => {
        const packageUrl = 'https://github.com/' + name + '.git'
        return mkdirp(path.dirname(packagePath))
          .then(() => {
            return git(['clone', packageUrl, packagePath]).catch((error) => {
              if (error.message.match(/already exists/i)) {
                return true // futher promises will resolve
              } else if (error.message.match(/repository not found/i)) {
                throw new Error('Package "' + name + '" does not exist on github')
              } else {
                throw error
              }
            })
          })
          .then(() => {
            return installStatus.set(name, 'cloned')
          })
      },
      {
        clean: () => {
          return jetpack.removeAsync(packagePath)
        },
      },
    )
  })
}

const gitPath = () => {
  return which.sync('git')
}

const isInstalled = () => {
  try {
    return gitPath() && !!gitSync(['--version'])
  } catch (error) {
    return false
  }
}

module.exports = { clone, pull, git, isInstalled }
