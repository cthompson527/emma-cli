'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const react_1 = __importDefault(require('react'))
const ink_1 = require('ink')
const ink_spinner_1 = __importDefault(require('ink-spinner'))
class Install extends react_1.default.Component {
  render() {
    const { active, dependencies, status } = this.props
    return react_1.default.createElement(
      ink_1.Box,
      { flexDirection: 'column' },
      react_1.default.createElement(
        ink_1.Box,
        null,
        react_1.default.createElement(
          ink_1.Text,
          { underline: true },
          'Installation',
        ),
      ),
      !active &&
        react_1.default.createElement(
          ink_1.Box,
          null,
          react_1.default.createElement(
            ink_1.Text,
            null,
            react_1.default.createElement(
              ink_1.Color,
              { grey: true },
              'Select packages to install.',
            ),
          ),
        ),
      active &&
        react_1.default.createElement(
          ink_1.Box,
          { flexDirection: 'column' },
          dependencies.length > 0 &&
            react_1.default.createElement(
              react_1.default.Fragment,
              null,
              (() => {
                switch (status) {
                  case 'NOT_STARTED': {
                    return react_1.default.createElement(
                      ink_1.Box,
                      null,
                      "We haven't started downloading dependencies yet.",
                    )
                  }
                  case 'INSTALLED': {
                    return react_1.default.createElement(
                      ink_1.Box,
                      null,
                      react_1.default.createElement(
                        ink_1.Color,
                        { greenBright: true },
                        'Successfully installed dependendencies!',
                      ),
                    )
                  }
                  case 'LOADING': {
                    return react_1.default.createElement(
                      ink_1.Box,
                      null,
                      react_1.default.createElement(
                        ink_1.Color,
                        { cyan: true },
                        'Loading dependendencies!',
                        react_1.default.createElement(
                          ink_spinner_1.default,
                          null,
                        ),
                      ),
                    )
                  }
                  case 'ERROR': {
                    return react_1.default.createElement(
                      ink_1.Box,
                      null,
                      react_1.default.createElement(
                        ink_1.Color,
                        { red: true },
                        "Couldn't install dependencies.",
                      ),
                    )
                  }
                }
              })(),
            ),
          dependencies.length === 0 &&
            react_1.default.createElement(
              ink_1.Box,
              null,
              react_1.default.createElement(
                ink_1.Color,
                { cyan: true },
                'Nothing to install...',
              ),
            ),
        ),
    )
  }
}
exports.default = Install
