import * as React from 'react'
import { component, requestSafeAction } from '../../src'
import { TLiquidUnit, LiquidUnitAbbreviation } from '../units/liquid'

const visualizationTimers = {}

const bucketStyle = {
  verticalAlign: 'bottom',
  display: 'inline-block',
  boxSizing: 'border-box' as any,
  width: '18px',
  marginRight: '4px',
  marginBottom: '4px',
  color: '#ace',
  fontSize: '12px',
  fontFamily: 'Georgia',
  fontStyle: 'italic',
  textAlign: 'center' as any,
  lineHeight: '30px'
}

const bucketColor = {
  boxSizing: 'border-box' as any,
  border: '1px solid #ace',
  background: '#def'
}

const renderBuckets = (quantity: number, unit: TLiquidUnit) => {
  const buckets = []
  const unitQuantity = Math.floor(quantity)
  for (let i = 0; i < unitQuantity; i++) {
    buckets.push(
      <div key={i} style={{
        ...bucketStyle,
        ...bucketColor,
        height: '26px'
      }}>
        1{LiquidUnitAbbreviation[unit]}
      </div>
    )
  }

  const remainder = quantity - unitQuantity

  if (remainder > 0) {
    buckets.push(
      <div key={'remainder'} style={{
        ...bucketStyle,
        height: '26px'
      }}>
        <div style={{
          ...bucketColor,
          height: `${remainder * 26}px`
        }} />
      </div>
    )
  }

  return buckets
}

export const LiquidVisualization = component('LiquidVisualization')
  .props<{
    quantity: number
    unit: TLiquidUnit
  }>()

  .state<{
    currentQuantity: number
  }>({ currentQuantity: 0 })

  .actions<{
    setCurrentQuantity: number
  }>({
    setCurrentQuantity: currentQuantity => ({ currentQuantity })
  })

  .render((props, state, actions) => {
    if (props.quantity !== state.currentQuantity) {
      const diffQuantity = props.quantity - state.currentQuantity
      const nextQuantity = Math.abs(diffQuantity) < 0.05 ?
        props.quantity :
        state.currentQuantity + diffQuantity / 3
      requestSafeAction(props.uuid, () => actions.setCurrentQuantity(nextQuantity))
    }

    return (
      <div style={{ width: '400px', margin: '1em 0' }}>
        {renderBuckets(state.currentQuantity, props.unit)}
      </div>
    )
  })
