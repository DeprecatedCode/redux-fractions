import * as React from 'react' // tslint:disable-line:no-implicit-dependencies
import { render } from 'react-dom' // tslint:disable-line:no-implicit-dependencies

import { Provider } from 'react-redux'
import { createStore } from 'redux' // tslint:disable-line:no-implicit-dependencies
import { fractionPersist, fractionReducer } from '../../src'

import { App } from './app'

const appContainer = document.getElementById('mathApp')
const appStore = createStore(fractionReducer)

fractionPersist('math-app')

render(
  <Provider store={appStore}>
    <App uuid="app" />
  </Provider>,
  appContainer
)
