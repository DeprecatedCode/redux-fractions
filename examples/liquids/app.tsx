import * as React from 'react' // tslint:disable-line:no-implicit-dependencies
import { component } from '../../src'

import { convertLiquidQuantity, TLiquidUnit } from './units/liquid'

import { Liquid } from './components/liquid'
import { LiquidVisualization } from './components/liquid-visualization'

const relativeQuantity = 2

export const App = component('App')
  .props<{
    itemName: string
  }>()

  .state<{
    count: number
    unit: TLiquidUnit
  }>({
    count: 0,
    unit: 'gallon'
  })

  .actions<{
    decrement: void
    increment: void
    setUnit: TLiquidUnit
  }>({
    decrement: () => state => ({ count: Math.max(0, state.count - 1) }),
    increment: () => state => ({ count: state.count + 1 }),
    setUnit: unit => state => ({
      count: convertLiquidQuantity(state.count, state.unit, unit),
      unit
    })
  })

  .render((props, state, actions) => (
    <div>
      <p>Welcome, guest: let's measure some {props.itemName}!</p>
      <Liquid unit={state.unit} quantity={state.count} />
      <LiquidVisualization
        uuid={`${props.uuid}.visualization1`}
        unit={state.unit}
        quantity={state.count}
      />
      <button onClick={() => actions.decrement()}>Remove 1 {state.unit}</button>
      <button onClick={() => actions.increment()}>Add 1 {state.unit}</button>
      <button onClick={() => actions.setUnit('liter')}>Use Metric</button>
      <button onClick={() => actions.setUnit('gallon')}>Use Imperial</button>
      <p>If there was twice as much:</p>
      <LiquidVisualization
        uuid={`${props.uuid}.visualization2`}
        unit={state.unit}
        quantity={state.count * relativeQuantity}
      />
    </div>
  ))
