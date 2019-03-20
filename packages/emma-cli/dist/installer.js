'use strict'
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k]
    result['default'] = mod
    return result
  }
Object.defineProperty(exports, '__esModule', { value: true })
const fs = __importStar(require('fs'))
const cp = __importStar(require('child_process'))
const execa = require('execa')
exports.dependencyTypes = ['dependency', 'devDependency']
exports.instructions = {
  dependency: { yarn: 'yarn add', npm: 'npm install --save' },
  devDependency: { yarn: 'yarn add -D', npm: 'npm install --save-dev' },
}
/**
 *
 * Returns the next dependency type in the chain.
 *
 * @param dependency
 */
function getNextDependencyType(type) {
  return exports.dependencyTypes[exports.dependencyTypes.indexOf(type) + 1]
}
exports.getNextDependencyType = getNextDependencyType
/* Installers */
/**
 *
 * Installation function for Yarn and NPM.
 *
 * @param deps
 * @param type
 */
async function install(deps, type) {
  const installer = getInstaller()
  const dependencies = deps.filter(dep => dep.type === type)
  const [, , ...argvs] = process.argv
  if (dependencies.length === 0) {
    return Promise.resolve(null)
  }
  const command = exports.instructions[type][installer]
  const pkgs = dependencies.map(({ name }) => name).join(' ')
  const args = argvs.join(' ')
  return execa.shell(`${command} ${pkgs} ${args}`, { stdio: `ignore` })
}
exports.install = install
/* Helpers */
/**
 * Finds installer for the current system.
 */
function getInstaller() {
  if (!fs.existsSync('package-lock.json') && isYarnInstalled()) {
    return 'yarn'
  } else {
    return 'npm'
  }
}
/**
 * Checks whether Yarn is installed on the computer.
 */
function isYarnInstalled() {
  try {
    cp.execSync(`yarnpkg --version`, { stdio: `ignore` })
    return true
  } catch (err) {
    return false
  }
}
