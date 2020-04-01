import path from 'path'
import jetpack from 'fs-jetpack'
import retry from './retry'
import { set } from './installStatus'
import { cooldown } from './manager'
import freshRequire from './pluginFreshRequire'

/**
 * If successful, will set the `installStatus` to `installed` and return it, to
 * communicate to `git clone` that we were successful and don't need to run
 * again, until a `git pull`.
 *
 * On failure, returns a rejected promise, so `retry` runs it again.
 */
const npmInstall = cooldown(
  (name, packagePath) => {
    return retry(`npm install [${name}]`, () => {
      const packageFile = path.join(packagePath, 'package.json')
      if (!jetpack.exists(packageFile)) {
        return set(name, 'nopackage')
      }
      const package_ = jetpack.read(packageFile, 'json')
      const dependencies = package_.dependencies
      if (!dependencies) {
        return set(name, 'nodeps')
      }
      const packages = Object.keys(dependencies).map((packageName) => {
        const packageVersion = dependencies[packageName]
        return packageName + '@' + packageVersion
      })
      return new Promise((resolve, reject) => {
        const npm = require('npm')
        npm.load({ production: true, optional: false, audit: false, 'strict-ssl': false }, (npmError) => {
          if (npmError) return reject(npmError)
          npm.commands.install(packagePath, packages, (error) => {
            if (error) return reject(error)
            set(name, 'installed').then(resolve)
          })
        })
      })
    })
  },
  () => {
    return freshRequire('npm')
  },
)

export default npmInstall
