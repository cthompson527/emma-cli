import React from 'react'
import { IDependency } from '../installer'
interface Props {
  dependencies: IDependency[]
  active: boolean
}
export default class Overview extends React.Component<Props> {
  render(): JSX.Element
  sortDependencies(deps: IDependency[]): IDependency[]
}
export {}
//# sourceMappingURL=Overview.d.ts.map
