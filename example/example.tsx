import * as React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { createDataSource, fractionReducer, IData } from '../index'

import { App } from './app' // Update to your main component import

const store = createStore(fractionReducer)

interface IAppData extends IData {
  userName: {
    type: string
  }
}

const appData = createDataSource<IAppData>({ userName: 'Abc' })

ReactDOM.render(
  <Provider store={store}>
    <App itemName='wine' dataSource={appData} />
  </Provider>,
  document.getElementById('exampleApp')
)
