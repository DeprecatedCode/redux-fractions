import * as React from 'react'
import { component } from '../../../src'
import { LiquidUnitPlural, TLiquidUnit } from '../units/liquid'

interface IProps {}

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
