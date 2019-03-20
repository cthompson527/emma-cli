import React from 'react'
interface Props<T> {
  active: boolean
  values: T[]
  children: (
    props: T & {
      active: boolean
    },
  ) => React.ReactNode
  onWillReachEnd: () => void
}
/**
 * Wraps the component in stdin consumer.
 */
export default class ScrollWithStdin<T> extends React.Component<Props<T>> {
  render(): JSX.Element
}
export {}
//# sourceMappingURL=Scroll.d.ts.map
