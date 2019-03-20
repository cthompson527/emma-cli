'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const react_1 = __importDefault(require('react'))
const ink_1 = require('ink')
exports.Heading = ({ children }) =>
  react_1.default.createElement(
    ink_1.Text,
    { underline: true },
    react_1.default.createElement(ink_1.Color, { green: true }, children),
  )
exports.default = exports.Heading
