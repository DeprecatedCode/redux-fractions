import * as React from 'react'
import { connect, Reducer, Renderer } from './index'

interface IProps {
  itemName: string
}

interface IState {
  count: number
}

const appState: IState = {
  count: 0
}

interface IActions {
  increment(): void
}

const appActions: Reducer<IState, IActions> = {
  increment: state => ({ count: state.count + 1 })
}

const appRenderer: Renderer<IState, IActions, IProps> = (state, actions, props) => (
  <div>
    <button
      onClick={actions.increment}
    >
      Current number of {props.itemName}: {state.count}
    </button>
  </div>
)

export const App = connect(appRenderer, appState, appActions)

const appInstance = <App itemName='animals' />

window.console.log(appInstance)
