#!/usr/bin/env node
'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const react_1 = __importDefault(require('react'))
const ink_1 = require('ink')
const meow_1 = __importDefault(require('meow'))
const multilines_1 = __importDefault(require('multilines'))
const update_notifier_1 = __importDefault(require('update-notifier'))
const _1 = __importDefault(require('.'))
/* Spec */
const cli = meow_1.default(multilines_1.default`
  | Usage
  |  $ emma
  |
  | Controls:
  |  - space: toggle dependencies
  |  - up/down: scroll the list
  |  - right/left: hide or show details
  |  - double right: show repo
  `)
/**
 * Make sure that user is on the latest version
 * avaiable in case they have connection to NPM.
 */
const notifier = update_notifier_1.default(cli)
notifier.notify()
if (notifier.update) {
  process.exit(0)
}
/* Main */
ink_1.render(react_1.default.createElement(_1.default, null), {
  exitOnCtrlC: false,
})
