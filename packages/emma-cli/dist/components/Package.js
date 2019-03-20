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
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const react_1 = __importStar(require('react'))
const ink_1 = require('ink')
const opn_1 = __importDefault(require('opn'))
const algolia_1 = require('../algolia')
const SPACE = ' '
const ARROW_LEFT = '\u001B[D'
const ARROW_RIGHT = '\u001B[C'
/* Package */
class Package extends react_1.PureComponent {
  constructor() {
    super(...arguments)
    this.state = {
      showDetails: false,
    }
    this.handleInput = data => {
      const { active, onClick, pkg } = this.props
      const char = String(data)
      if (!active) return
      switch (char) {
        case SPACE: {
          return onClick(pkg)
        }
        case ARROW_RIGHT: {
          if (this.state.showDetails && pkg.repository) {
            opn_1.default(pkg.repository.url)
          }
          return this.setState({ showDetails: true })
        }
        case ARROW_LEFT: {
          return this.setState({ showDetails: false })
        }
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
  /**
   *
   * Removes details view when not active anymore.
   *
   * @param props
   * @param state
   */
  static getDerivedStateFromProps(props, state) {
    if (props.active === false)
      return Object.assign({}, state, { showDetails: false })
    return null
  }
  render() {
    const { pkg, active, type } = this.props
    const { showDetails } = this.state
    const Cursor = () =>
      react_1.default.createElement(
        ink_1.Box,
        { marginRight: 1 },
        (() => {
          if (active) {
            if (type === 'dependency')
              return react_1.default.createElement(
                ink_1.Color,
                { cyan: true },
                `›`,
              )
            if (type === 'devDependency')
              return react_1.default.createElement(
                ink_1.Color,
                { blue: true },
                `›`,
              )
            return react_1.default.createElement(
              ink_1.Color,
              { magenta: true },
              `›`,
            )
          } else {
            if (type === 'dependency')
              return react_1.default.createElement(
                ink_1.Color,
                { cyan: true },
                `◉`,
              )
            if (type === 'devDependency')
              return react_1.default.createElement(
                ink_1.Color,
                { blue: true },
                `◉`,
              )
            return react_1.default.createElement(ink_1.Text, null, ` `)
          }
        })(),
      )
    const Downloads = () =>
      react_1.default.createElement(
        ink_1.Box,
        {
          width: this.getColumnWidth('humanDownloadsLast30Days'),
          marginRight: 1,
        },
        react_1.default.createElement(
          ink_1.Text,
          null,
          pkg.humanDownloadsLast30Days,
        ),
      )
    const Name = () =>
      react_1.default.createElement(
        ink_1.Box,
        { width: this.getColumnWidth('name'), marginRight: 1 },
        react_1.default.createElement(ink_1.Text, { bold: true }, pkg.name),
      )
    const Owner = () =>
      react_1.default.createElement(
        ink_1.Box,
        { width: this.getColumnWidth('owner') },
        react_1.default.createElement(
          ink_1.Text,
          null,
          react_1.default.createElement(
            ink_1.Color,
            { grey: true },
            pkg.owner.name,
          ),
        ),
      )
    const Description = () =>
      react_1.default.createElement(
        ink_1.Box,
        { flexDirection: 'row', marginX: 2 },
        react_1.default.createElement(ink_1.Text, null, pkg.description),
      )
    if (showDetails) {
      return react_1.default.createElement(
        ink_1.Box,
        { flexDirection: 'column', marginY: 1 },
        react_1.default.createElement(
          ink_1.Box,
          { flexDirection: 'row' },
          react_1.default.createElement(Cursor, null),
          react_1.default.createElement(Downloads, null),
          react_1.default.createElement(Name, null),
          react_1.default.createElement(Owner, null),
        ),
        react_1.default.createElement(
          ink_1.Box,
          null,
          react_1.default.createElement(Description, null),
        ),
      )
    }
    return react_1.default.createElement(
      ink_1.Box,
      { flexDirection: 'row', marginY: 0, marginX: 0 },
      react_1.default.createElement(Cursor, null),
      react_1.default.createElement(Downloads, null),
      react_1.default.createElement(Name, null),
      react_1.default.createElement(Owner, null),
    )
  }
  /**
   *
   * Calculates the width of each column in the list.
   *
   * @param column
   */
  getColumnWidth(column) {
    const hits = this.props.hits
      .map(hit => {
        switch (column) {
          case 'owner': {
            return hit.owner.name
          }
          case 'repository': {
            if (hit.repository) {
              return hit.repository.url
            } else {
              return ''
            }
          }
          default: {
            return hit[column]
          }
        }
      })
      .map(c => c.length)
    return Math.max(...hits)
  }
}
class PackageWithStdinAndHits extends react_1.default.Component {
  render() {
    return react_1.default.createElement(
      algolia_1.SearchContext.Consumer,
      null,
      values =>
        react_1.default.createElement(
          ink_1.StdinContext.Consumer,
          null,
          ({ stdin, setRawMode }) =>
            react_1.default.createElement(
              Package,
              Object.assign({}, this.props, {
                stdin: stdin,
                setRawMode: setRawMode,
                hits: values,
              }),
            ),
        ),
    )
  }
}
exports.default = PackageWithStdinAndHits
