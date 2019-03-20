import React from 'react'
import { IPackage } from '../algolia'
import { IDependency } from '../installer'
interface Props {
  pkg: IPackage
  active: boolean
  onClick: (pkg: IPackage) => void
  type: IDependency['type'] | undefined
}
export default class PackageWithStdinAndHits extends React.Component<Props> {
  render(): JSX.Element
}
export {}
//# sourceMappingURL=Package.d.ts.map
