'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const react_1 = __importDefault(require('react'))
const ink_1 = require('ink')
exports.default = () =>
  react_1.default.createElement(
    ink_1.Box,
    { flexDirection: 'row' },
    react_1.default.createElement(
      ink_1.Text,
      null,
      react_1.default.createElement(
        ink_1.Color,
        { grey: true },
        'Press right on package for details',
      ),
    ),
  )
