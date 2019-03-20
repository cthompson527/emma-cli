'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const react_1 = __importDefault(require('react'))
const ink_1 = require('ink')
const Heading_1 = __importDefault(require('./Heading'))
const Dependency_1 = __importDefault(require('./Dependency'))
class Overview extends react_1.default.Component {
  render() {
    const { dependencies, active } = this.props
    const deps = this.sortDependencies(
      dependencies.filter(d => d.type === 'dependency'),
    )
    const devDeps = this.sortDependencies(
      dependencies.filter(d => d.type === 'devDependency'),
    )
    return react_1.default.createElement(
      ink_1.Box,
      { flexDirection: 'column' },
      react_1.default.createElement(
        ink_1.Text,
        { underline: true },
        'Overview',
      ),
      deps.length > 0 &&
        react_1.default.createElement(
          react_1.default.Fragment,
          null,
          react_1.default.createElement(
            Heading_1.default,
            null,
            'dependencies',
          ),
          deps.map(dep =>
            react_1.default.createElement(Dependency_1.default, {
              key: dep.name,
              data: dep,
            }),
          ),
        ),
      devDeps.length > 0 &&
        react_1.default.createElement(
          react_1.default.Fragment,
          null,
          react_1.default.createElement(
            Heading_1.default,
            null,
            'devDependencies',
          ),
          devDeps.map(dep =>
            react_1.default.createElement(Dependency_1.default, {
              key: dep.name,
              data: dep,
            }),
          ),
        ),
      deps.length === 0 &&
        devDeps.length === 0 &&
        react_1.default.createElement(
          ink_1.Text,
          null,
          react_1.default.createElement(
            ink_1.Color,
            { grey: true },
            'Select packages using space!',
          ),
        ),
      active &&
        react_1.default.createElement(
          ink_1.Color,
          { greenBright: true },
          `Press enter to install...`,
        ),
    )
  }
  sortDependencies(deps) {
    return deps.sort((depA, depB) => {
      if (depA.type > depB.type) return 1
      if (depA.type < depB.type) return -1
      return 0
    })
  }
}
exports.default = Overview
