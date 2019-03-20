'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const react_1 = __importDefault(require('react'))
const ink_1 = require('ink')
const ARROW_UP = '\u001B[A'
const ARROW_DOWN = '\u001B[B'
class Scroll extends react_1.default.Component {
  constructor() {
    super(...arguments)
    /* Number of items displayed in the list at once. */
    this.window = 5
    this.state = {
      cursor: 0,
    }
    this.handleInput = data => {
      const { active, values } = this.props
      const { cursor } = this.state
      /* Prevent any action if element is out of focus. */
      if (!active) return
      /* Decode char */
      const char = String(data)
      switch (char) {
        case ARROW_UP:
          if (cursor - 1 >= 0) this.setState({ cursor: cursor - 1 })
          break
        case ARROW_DOWN:
          if (cursor + 1 < values.length) this.setState({ cursor: cursor + 1 })
          break
      }
    }
    /**
     * Calculates the mask begining position.
     */
    this.getMask = () => {
      const values = this.props.values
      const cursor = this.state.cursor
      const size = this.window
      /** Distance from the cursor to the top of mask. */
      const offset = Math.floor(size / 2)
      /** Items are shorter than mask. */
      if (values.length <= size) return 0
      /** Cursor has moved above the middle point of the mask. */
      if (cursor - offset <= 0) return 0
      /** Cursor has moved past the middle point of the mask. */
      if (cursor + offset >= values.length) return values.length - size
      /** Cursor is in the "middle" of the list. */
      return cursor - offset
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
  /**
   *
   * This ensures that cursor stays in sync with the most recent props.
   *
   * @param props
   * @param state
   */
  static getDerivedStateFromProps(props, state) {
    if (props.active === false) return Object.assign({}, state, { cursor: 0 })
    if (props.values.length < state.cursor) {
      return Object.assign({}, state, { cursor: props.values.length })
    }
    return null
  }
  /**
   *
   * Makes sure that the outside world knows where we are.
   *
   * @param props
   * @param state
   */
  componentDidUpdate() {
    const cursor = this.state.cursor
    /**
     * Trigger onWillReachEnd on the second last item in the list.
     */
    if (cursor === this.props.values.length - 2) this.props.onWillReachEnd()
  }
  render() {
    const mask = this.getMask(),
      cursor = this.state.cursor,
      size = this.window,
      values = this.props.values.slice(mask, mask + size),
      render = this.props.children
    return react_1.default.createElement(
      ink_1.Box,
      { flexDirection: 'column' },
      values.length === 0 &&
        react_1.default.createElement(
          ink_1.Text,
          null,
          react_1.default.createElement(
            ink_1.Color,
            { grey: true },
            'Start typing or change query so we can find something!',
          ),
        ),
      values.map((value, i) =>
        render(
          Object.assign({}, value, {
            active: this.props.active && i + mask === cursor,
          }),
        ),
      ),
    )
  }
}
/**
 * Wraps the component in stdin consumer.
 */
class ScrollWithStdin extends react_1.default.Component {
  render() {
    return react_1.default.createElement(
      ink_1.StdinContext.Consumer,
      null,
      ({ stdin, setRawMode }) =>
        react_1.default.createElement(
          Scroll,
          Object.assign({}, this.props, {
            stdin: stdin,
            setRawMode: setRawMode,
          }),
        ),
    )
  }
}
exports.default = ScrollWithStdin
