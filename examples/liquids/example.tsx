import * as React from 'react'
import { render } from 'react-dom'

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { fractionReducer, fractionPersist } from '../../src'

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
