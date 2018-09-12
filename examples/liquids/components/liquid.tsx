import * as React from 'react' // tslint:disable-line:no-implicit-dependencies
import { component } from '../../../src'
import { LiquidUnitPlural, TLiquidUnit } from '../units/liquid'

export const Liquid = component('Liquid')
  .props<{
    quantity: number
    unit: TLiquidUnit
  }>()

  .render(props => (
    <p>
      Current amount of liquid: {props.quantity.toFixed(1)}{' '}
      {LiquidUnitPlural[props.unit]}.
    </p>
  ))
