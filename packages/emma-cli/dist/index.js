'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const react_1 = __importDefault(require('react'))
const ink_1 = require('ink')
const algolia_1 = require('./algolia')
const Footer_1 = require('./components/Footer')
const Install_1 = __importDefault(require('./components/Install'))
const Overview_1 = __importDefault(require('./components/Overview'))
const Package_1 = __importDefault(require('./components/Package'))
const Scroll_1 = __importDefault(require('./components/Scroll'))
const Search_1 = __importDefault(require('./components/Search'))
const installer_1 = require('./installer')
const utils_1 = require('./utils')
const SPACE = ' '
const ARROW_UP = '\u001B[A'
const ARROW_DOWN = '\u001B[B'
const ENTER = '\r'
const CTRL_C = '\x03'
class Emma extends react_1.default.Component {
  constructor(props) {
    super(props)
    this.state = {
      view: 'SEARCH',
      query: '',
      page: 0,
      hits: [],
      loading: false,
      dependencies: {},
      status: 'NOT_STARTED',
    }
    /**
     * Creates a new dependency if newly selected or toggles the existing one.
     */
    this.toggleDependency = pkg => {
      const { dependencies } = this.state
      const dependency = dependencies[pkg.name]
      if (dependency === undefined) {
        this.setState({
          dependencies: Object.assign({}, dependencies, {
            [pkg.name]: { name: pkg.name, type: 'dependency' },
          }),
        })
      } else {
        const nextType = installer_1.getNextDependencyType(dependency.type)
        if (nextType) {
          this.setState({
            dependencies: Object.assign({}, dependencies, {
              [pkg.name]: { name: pkg.name, type: nextType },
            }),
          })
        } else {
          this.setState({
            dependencies: utils_1.removeKey(pkg.name, dependencies),
          })
        }
      }
    }
    this.handleQueryChange = this.handleQueryChange.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.handleWillReachEnd = this.handleWillReachEnd.bind(this)
    this.installDependencies = this.installDependencies.bind(this)
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
   * Keyboard events manager split based on the active view.
   */
  async handleInput(data) {
    const s = String(data)
    /**
     * Create an exit listener.
     */
    if (s === CTRL_C) {
      process.exit(0)
    }
    switch (this.state.view) {
      case 'SEARCH': {
        if (s === ARROW_DOWN || s === ENTER || SPACE) {
          this.setState({ view: 'SCROLL' })
        }
        return
      }
      case 'SCROLL': {
        if (s === ENTER) {
          this.setState({ view: 'OVERVIEW' })
        }
        return
      }
      case 'OVERVIEW': {
        if (s === ARROW_UP || ARROW_DOWN) {
          this.setState({ view: 'SCROLL' })
        }
        if (s === ENTER) {
          if (Object.values(this.state.dependencies).length > 0) {
            this.setState({ view: 'INSTALL' })
            try {
              await this.installDependencies()
              process.exit(0)
            } catch (err) {
              process.exit(1)
            }
          } else {
            process.exit(0)
          }
        }
        return
      }
      case 'INSTALL': {
        return
      }
    }
  }
  /**
   * Whenever input changes, switch to the initial screen, change the value
   * of the query accordingly, reset pagination and perform search.
   */
  async handleQueryChange(value) {
    this.setState({
      query: value,
      page: 0,
      view: 'SEARCH',
      loading: true,
    })
    const res = await algolia_1.search(value)
    if (res.query === this.state.query) {
      this.setState({ hits: res.hits, loading: false })
    }
  }
  /**
   * Start querying new hits and update pagination. But limit pagniation to
   * ten pages.
   */
  async handleWillReachEnd() {
    const { query, hits, page } = this.state
    if (page > 10) return
    const res = await algolia_1.search(query, page + 1)
    if (res.query === this.state.query && res.page - 1 === this.state.page) {
      this.setState({
        page: res.page,
        hits: [...hits, ...res.hits],
      })
    }
  }
  async installDependencies() {
    this.setState({ status: 'LOADING' })
    try {
      await Promise.all([
        installer_1.install(
          Object.values(this.state.dependencies),
          'dependency',
        ),
        installer_1.install(
          Object.values(this.state.dependencies),
          'devDependency',
        ),
      ])
      this.setState({ status: 'INSTALLED' })
    } catch (err) {
      this.setState({ status: 'ERROR' })
      throw err
    }
  }
  render() {
    const { view, query, loading, hits, dependencies, status } = this.state
    return react_1.default.createElement(
      algolia_1.SearchContext.Provider,
      { value: hits },
      react_1.default.createElement(
        ink_1.Box,
        { flexDirection: 'column' },
        react_1.default.createElement(Search_1.default, {
          value: query,
          onChange: this.handleQueryChange,
          loading: loading,
          active: true,
        }),
        react_1.default.createElement(
          Scroll_1.default,
          {
            values: this.state.hits,
            onWillReachEnd: this.handleWillReachEnd,
            active: view === 'SCROLL',
          },
          pkg =>
            react_1.default.createElement(Package_1.default, {
              key: pkg.objectID,
              pkg: pkg,
              onClick: this.toggleDependency,
              active: pkg.active,
              type: (dependencies[pkg.name] || {}).type,
            }),
        ),
        react_1.default.createElement(Overview_1.default, {
          dependencies: Object.values(dependencies),
          active: view === 'OVERVIEW',
        }),
        react_1.default.createElement(Install_1.default, {
          dependencies: Object.values(dependencies),
          status: status,
          active: view === 'INSTALL',
        }),
        react_1.default.createElement(Footer_1.Footer, null),
      ),
    )
  }
}
class EmmaWithStdin extends react_1.default.Component {
  render() {
    return react_1.default.createElement(
      ink_1.StdinContext.Consumer,
      null,
      ({ stdin, setRawMode }) =>
        react_1.default.createElement(
          Emma,
          Object.assign({}, this.props, {
            stdin: stdin,
            setRawMode: setRawMode,
          }),
        ),
    )
  }
}
exports.default = EmmaWithStdin
