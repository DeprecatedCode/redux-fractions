import * as React from 'react'
import { connect, IComponent } from '../index'

interface IApp extends IComponent {
  actions: {
    increment: void
    setUnit: string
  }

  data: {
    userName: {
      type: string
    }
  }

  props: {
    itemName: string
  }

  state: {
    count: number
    unit: string
  }
}

export const App = connect<IApp>('App', {
  state: {
    count: 0,
    unit: 'gallons'
  },

  reducers: {
    increment: state => ({ count: state.count + 1 }),
    setUnit: (state, unit) => ({ count: 0, unit })
  },

  render({ actions, data, props, state }, dataSource) {
    dataSource.userName()

    if (!data.userName.ready) {
      return <div>Please wait...</div>
    }

    return (
      <div>
        <p>Welcome, {data.userName.value}!</p>
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
