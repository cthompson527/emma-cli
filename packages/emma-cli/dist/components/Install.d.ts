import React from 'react'
import { IDependency } from '../installer'
interface Props {
  active: boolean
  dependencies: IDependency[]
  status: InstallationStatus
}
export declare type InstallationStatus =
  | 'NOT_STARTED'
  | 'LOADING'
  | 'INSTALLED'
  | 'ERROR'
export default class Install extends React.Component<Props> {
  render(): JSX.Element
}
export {}
//# sourceMappingURL=Install.d.ts.map
