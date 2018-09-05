import * as React from 'react'
import { render } from 'react-dom'

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { fractionReducer, fractionPersist } from '../../src'

import { HelloApp } from './hello-app'

const appContainer = document.getElementById('helloApp')
const appStore = createStore(fractionReducer)

fractionPersist('hello-world-app')

render(
  <Provider store={appStore}>
    <HelloApp uuid='app' planet='Earth' />
  </Provider>,
  appContainer
)
