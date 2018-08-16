# redux-fractions
FastReduxACTIONS combines Flux Standard Action creators and reducers

## Installation

`npm install --save redux-fractions`

## Contributing

This package is written in TypeScript. Run tslint with `npm lint` before submitting a pull request. To continuously watch your code and lint on changes, use the `npm run lint-watch` command. To build, run `npm run build`.

## Usage with Redux Store

Suggested to use as the root reducer:

```TypeScript
import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { fractionReducer } from 'redux-fractions'

import { App } from './app' // Update to your main component import

const store = createStore(fractionReducer)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
```

## Usage in a Component

Use redux-fractions' `connect` method in place of the standard redux `connect` method:

```TypeScript
import * as React from 'react'
import { connect, Reducer, Renderer } from 'redux-fractions'

interface IState {
  count: number
}

const appState: IState = {
  count: 0
}

interface IActions {
  increment: () => void
}

const appActions: Reducer<IState, IActions> = {
  increment: state => {
    return { count: state.count + 1 }
  }
}

const appRenderer: Renderer<IState, IActions> = (state, actions) => (
  <div>
    <button
      onClick={actions.increment}
    >
      Current count: {state.count}
    </button>
  </div>
)

export const App = connect(appRenderer, appState, appActions)
```

If your component uses external props, such as `<App itemName="animals" />`, just add a 3rd type parameter to `Renderer<IState, IActions, IProps>`:

```TypeScript
import * as React from 'react'
import { connect, Reducer, Renderer } from 'redux-fractions'

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
  increment: () => void
}

const appActions: Reducer<IState, IActions> = {
  increment: state => {
    return { count: state.count + 1 }
  }
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
```

That's all you need to create a working app with react, redux, and redux-fractions!
