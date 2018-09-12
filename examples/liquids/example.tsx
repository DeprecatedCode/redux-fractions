import * as React from 'react' // tslint:disable-line:no-implicit-dependencies
import { render } from 'react-dom' // tslint:disable-line:no-implicit-dependencies

import { Provider } from 'react-redux'
import { createStore } from 'redux' // tslint:disable-line:no-implicit-dependencies
import { fractionPersist, fractionReducer } from '../../src'

import { App } from './app'

const appContainer = document.getElementById('exampleApp')
const appStore = createStore(fractionReducer)

fractionPersist('example-app')

render(
  <Provider store={appStore}>
    <App itemName='wine' uuid='app' />
  </Provider>,
  appContainer
)
