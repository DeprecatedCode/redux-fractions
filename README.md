# redux-fractions
FastReduxACTIONS combines Flux Standard Action creators and reducers

## Installation

`yarn add redux-fractions` or `npm install --save redux-fractions`

## Contributing

This package is written in Typescript. Run tslint with `yarn lint` before submitting a pull request. To continuously watch your code and lint on changes, use the `yarn lint-watch` command.

## Usage with Redux Store

Suggested to use as the root reducer:

```typescript
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

```typescript
import React, { Component } from 'react'
import { connect, FractionReducers } from 'redux-fractions'

interface IState {
  count: number
}

const initialState: IState = {
  count: 0
}

interface IActions {
  increment: () => void
}

const appActions: FractionReducers<IState, IActions> = {
  increment: state => {
    return { count: state.count + 1 }
  }
}

export class AppComponent extends Component<IState & IActions> {
  public render() {
    const { count, increment } = this.props

    return <div>
      <button
        onClick={increment}
      >
        Current count: {count}
      </button>
    </div>
  }
}

export const App = connect<
  AppComponent,
  IState,
  IActions
>(
  AppComponent,
  initialState,
  appActions
)
```

If your component has props, you just need to add a 4th type parameter to `connect`:

```typescript
import React, { Component } from 'react'
import { connect, FractionReducers } from 'redux-fractions'

interface IProps {
  itemName: string
}

interface IState {
  count: number
}

const initialState: IState = {
  count: 0
}

interface IActions {
  increment: () => void
}

const appActions: FractionReducers<IProps & IState, IActions> = {
  increment: state => {
    return { count: state.count + 1 }
  }
}

export class AppComponent extends Component<IProps & IState & IActions> {
  public render() {
    const { count, increment, itemName } = this.props

    return <div>
      <button
        onClick={increment}
      >
        Current number of {itemName}: {count}
      </button>
    </div>
  }
}

export const App = connect<
  AppComponent,
  IState,
  IActions,
  IProps // <- props interface goes here to expose external props!
>(
  AppComponent,
  initialState,
  appActions
)
```

That's all you need to create a working app with react, redux, and redux-fractions!
