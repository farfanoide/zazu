'use strict'

const gulp = require('gulp')
const ghpages = require('gh-pages')
const path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')

const appVersion = () => {
  const packageJson = 'package.json'
  const packageContent = JSON.parse(fs.readFileSync(packageJson))
  return packageContent.version
}

const commitSha = () => {
  return execSync('git rev-parse HEAD').toString()
}

const setupDynamicConfig = documentationConfigFile => {
  fs.writeFileSync(documentationConfigFile, `currentCommitSha: ${commitSha()}\n`, { flag: 'a' })
  fs.writeFileSync(documentationConfigFile, `currentAppVersion: ${appVersion()}\n`, { flag: 'a' })
}

const cleanupDynamicConfig = documentationConfigFile => {
  const data = fs.readFileSync(documentationConfigFile)
  fs.writeFileSync(
    documentationConfigFile,
    data
      .toString()
      .split('\n')
      .filter(line => {
        return !line.match(/currentCommitSha|currentAppVersion/)
      })
      .join('\n')
      .trim() + '\n',
  )
}

gulp.task('ghpages', () => {
  const documentationDirectory = path.join('docs')
  const documentationConfigFile = path.join(documentationDirectory, '_config.yml')
  setupDynamicConfig(documentationConfigFile)
  console.log('start publishing')
  return new Promise((resolve, reject) => {
    ghpages.publish(documentationDirectory, { dotfiles: true }, error => {
      if (error) {
        console.error(error)
        reject(error)
      } else {
        cleanupDynamicConfig(documentationConfigFile)
        console.log('Deployed documentation')
        resolve()
      }
    })
  })
})
