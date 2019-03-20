import { PureComponent } from 'react'
interface Props {
  active: boolean
  value: string
  onChange: (q: string) => void
  loading: boolean
}
export default class SearchWithStdin extends PureComponent<Props> {
  render(): JSX.Element
}
export {}
//# sourceMappingURL=Search.d.ts.map
