# redux-fractions
FastReduxACTIONS combines Flux Standard Action creators and reducers

## Installation

`npm install --save redux-fractions`

## Contributing

This package is written in TypeScript. Run tslint with `npm lint` before submitting a pull request. To continuously watch your code and lint on changes, use the `npm run lint-watch` command. To build, run `npm run build`.

## Usage with Redux Store

Suggested to use as the root reducer:

```TypeScript
import * as React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { fractionReducer } from '../index'

import { App } from './app' // Update to your main component import

const store = createStore(fractionReducer)

ReactDOM.render(
  <Provider store={store}>
    <App itemName='wine' />
  </Provider>,
  document.getElementById('exampleApp')
)
```

## Usage in a Component

Use redux-fractions' `connect` method in place of the standard redux `connect` method:

```TypeScript
import * as React from 'react'
import { connect, IComponent } from '../index'

interface IApp extends IComponent {
  actions: {
    increment: void
    setUnit: string
  }

  data: {
    userName: string
  }

  props: {
    itemName: string
  }

  state: {
    count: number
    unit: string
  }
}

export const App = connect<IApp>('app', {
  state: {
    count: 0,
    unit: 'gallons'
  },

  reducers: {
    increment: state => ({ count: state.count + 1 }),
    setUnit: (state, unit) => ({ count: 0, unit })
  },

  render({ actions, data, props, state }) {
    return (
      <div>
        <p>Welcome, {data.userName}!</p>
        <button
          onClick={() => actions.increment()}
        >
          Current amount of {props.itemName}: {state.count} {state.unit}
        </button>
        <button
          onClick={() => actions.setUnit('liters')}
        >
          Use Metric
        </button>
        <button
          onClick={() => actions.setUnit('gallons')}
        >
          Use Imperial
        </button>
      </div>
    )
  }
})
```

That's all you need to create a working app with react, redux, and redux-fractions!
