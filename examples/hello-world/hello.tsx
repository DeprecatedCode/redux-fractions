import * as React from 'react' // tslint:disable-line:no-implicit-dependencies
import { render } from 'react-dom' // tslint:disable-line:no-implicit-dependencies

import { Provider } from 'react-redux'
import { createStore } from 'redux' // tslint:disable-line:no-implicit-dependencies
import { fractionPersist, fractionReducer } from '../../src'

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
