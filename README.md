# redux-fractions
FastReduxACTIONS combines Flux Standard Action creators and reducers

## Installation

`npm install --save redux-fractions`

## Contributing

This package is written in TypeScript. Run tslint with `npm lint` before submitting a pull request. To continuously watch your code and lint on changes, use the `npm run lint-watch` command. To build, run `npm run build`.

## Running the Examples

Use [Parcel](https://parceljs.org/), for example: `parcel -p 3000 examples/hello-world/index.html` or `parcel -p 3000 examples/math/index.html`

## Usage with Redux Store

Suggested to use as the root reducer:

```TypeScript
import * as React from 'react'
import { render } from 'react-dom'

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { fractionReducer } from '../../src'

import { App } from './app'

const appContainer = document.getElementById('helloApp')
const appStore = createStore(fractionReducer)

render(
  <Provider store={appStore}>
    <HelloApp uuid='app' planet='Earth' />
  </Provider>,
  appContainer
)
```

## Usage in a Component

Use redux-fractions' `component()` method to create a component:

```TypeScript
import * as React from 'react'
import { component } from 'redux-fractions'

export const HelloApp = component('HelloApp')
  .props<{
    planet: string
  }>()

  .state<{
    name: string
  }>({
    name: 'human'
  })

  .actions<{
    setName: string
  }>({
    setName: name => ({ name })
  })

  .render((props, state, actions) => (
    <div>
      <label>Enter your name:</label>
      <p>
        <input type='text' onChange={event => actions.setName(event.target.value)} value={state.name} />
      </p>
      <p>Hello, {state.name} from planet {props.planet}!</p>
    </div>
  ))
```

That's all you need to create a working app with react, redux, and redux-fractions!
