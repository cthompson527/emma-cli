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
const react_1 = __importStar(require('react'))
const ink_1 = require('ink')
const ARROW_UP = '\u001B[A'
const ARROW_DOWN = '\u001B[B'
const ARROW_LEFT = '\u001B[D'
const ARROW_RIGHT = '\u001B[C'
const ENTER = '\r'
const CTRL_C = '\x03'
const SPACE = ' '
const BACKSPACE = '\x08'
const DELETE = '\x7F'
class Search extends react_1.default.Component {
  constructor() {
    super(...arguments)
    this.handleInput = data => {
      const { active, value, onChange } = this.props
      const char = String(data)
      /**
       * Ignored input.
       */
      if (
        [
          ARROW_UP,
          ARROW_DOWN,
          ARROW_LEFT,
          ARROW_RIGHT,
          ENTER,
          CTRL_C,
          SPACE,
        ].includes(char) ||
        !active
      ) {
        return
      }
      /**
       * Text input.
       */
      if (char === BACKSPACE || char === DELETE) {
        onChange(value.slice(0, value.length - 1))
      } else {
        onChange(`${value}${char}`)
      }
    }
  }
  componentDidMount() {
    const { stdin, setRawMode } = this.props
    if (setRawMode) setRawMode(true)
    stdin.on('data', this.handleInput)
  }
  componentWillUnmount() {
    const { stdin, setRawMode } = this.props
    stdin.removeListener('data', this.handleInput)
    if (setRawMode) setRawMode(false)
  }
  render() {
    const { value } = this.props
    const hasValue = value.length > 0
    return react_1.default.createElement(
      ink_1.Box,
      { flexDirection: 'row' },
      react_1.default.createElement(
        ink_1.Box,
        { marginRight: 1 },
        react_1.default.createElement(
          ink_1.Text,
          null,
          'Search packages on ',
          react_1.default.createElement(ink_1.Color, { cyan: true }, 'Yarn'),
          ':',
        ),
      ),
      react_1.default.createElement(
        ink_1.Box,
        null,
        react_1.default.createElement(
          ink_1.Color,
          { dim: !hasValue },
          hasValue ? value : 'create-emma',
        ),
      ),
    )
  }
}
class SearchWithStdin extends react_1.PureComponent {
  render() {
    return react_1.default.createElement(
      ink_1.StdinContext.Consumer,
      null,
      ({ stdin, setRawMode }) =>
        react_1.default.createElement(
          Search,
          Object.assign({}, this.props, {
            stdin: stdin,
            setRawMode: setRawMode,
          }),
        ),
    )
  }
}
exports.default = SearchWithStdin
