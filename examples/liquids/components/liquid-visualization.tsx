import * as React from 'react' // tslint:disable-line:no-implicit-dependencies
import { component, requestSafeAction } from '../../../src'
import { LiquidUnitAbbreviation, TLiquidUnit } from '../units/liquid'

const bucketStyle = {
  boxSizing: 'border-box' as any,
  color: '#ace',
  display: 'inline-block',
  fontFamily: 'Georgia',
  fontSize: '12px',
  fontStyle: 'italic',
  lineHeight: '30px',
  marginBottom: '4px',
  marginRight: '4px',
  textAlign: 'center' as any,
  verticalAlign: 'bottom',
  width: '18px'
}

const bucketColor = {
  background: '#def',
  border: '1px solid #ace',
  boxSizing: 'border-box' as any
}

const renderBuckets = (quantity: number, unit: TLiquidUnit) => {
  const buckets = []
  const unitQuantity = Math.floor(quantity)
  for (let i = 0; i < unitQuantity; i++) {
    buckets.push(
      <div
        key={i}
        style={{
          ...bucketStyle,
          ...bucketColor,
          height: '26px'
        }}
      >
        1{LiquidUnitAbbreviation[unit]}
      </div>
    )
  }

  const remainder = quantity - unitQuantity
  const bucketHeight = 26

  if (remainder > 0) {
    buckets.push(
      <div
        key={'remainder'}
        style={{
          ...bucketStyle,
          height: `${bucketHeight}px`
        }}
      >
        <div
          style={{
            ...bucketColor,
            height: `${remainder * bucketHeight}px`
          }}
        />
      </div>
    )
  }

  return buckets
}

const diffThreshold = 0.05
const diffSpeed = 3

export const LiquidVisualization = component('LiquidVisualization')
  .props<{
    quantity: number
    unit: TLiquidUnit
  }>()

  .state<{
    _: {
      currentQuantity: number
    }
  }>({
    _: { currentQuantity: 0 }
  })

  .actions<{
    setCurrentQuantity: number
  }>({
    setCurrentQuantity: currentQuantity => ({
      _: {
        currentQuantity
      }
    })
  })

  .render((props, state, actions) => {
    if (props.quantity !== state._.currentQuantity) {
      const diffQuantity = props.quantity - state._.currentQuantity
      const nextQuantity =
        Math.abs(diffQuantity) < diffThreshold
          ? props.quantity
          : state._.currentQuantity + diffQuantity / diffSpeed
      requestSafeAction(props.uuid, () =>
        actions.setCurrentQuantity(nextQuantity)
      )
    }

    return (
      <div style={{ width: '400px', margin: '1em 0' }}>
        {renderBuckets(state._.currentQuantity, props.unit)}
      </div>
    )
  })
