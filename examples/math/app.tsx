import * as React from 'react'
import { component } from '../../src'

const buttonStyle = (selected: boolean) => ({
  backgroundColor: '#ccc',
  borderRadius: '3px',
  margin: '2px',
  ...(
    selected ?
      {
        backgroundColor: 'blue',
        color: 'white'
      } :
      {}
  )
})

const doMath = (x: number, y: number, operand: string) => {
  switch (operand) {
    case '+':
      return x + y
    case '-':
      return x - y
    case '×':
      return x * y
    case '÷':
      return x / y
    default:
      return 'Err'
  }
}

export const App = component('App')
  .state<{
    x: number
    y: number
    operand: string
  }>({
    x: 0,
    y: 0,
    operand: '+'
  })
  .actions<{
    setX: number
    setY: number
    setOperand: string
  }>({
    setX: x => ({ x: isNaN(x) ? 0 : x }),
    setY: y => ({ y: isNaN(y) ? 0 : y }),
    setOperand: operand => ({ operand })
  })
  .render((state, actions) => (
    <div>
      <input type='number' onChange={event => actions.setX(event.target.valueAsNumber)} value={state.x} />
      <button style={buttonStyle(state.operand === '+')} disabled={state.operand === '+'} onClick={() => actions.setOperand('+')}>+</button>
      <button style={buttonStyle(state.operand === '-')} disabled={state.operand === '-'} onClick={() => actions.setOperand('-')}>-</button>
      <button style={buttonStyle(state.operand === '×')} disabled={state.operand === '×'} onClick={() => actions.setOperand('×')}>×</button>
      <button style={buttonStyle(state.operand === '÷')} disabled={state.operand === '÷'} onClick={() => actions.setOperand('÷')}>÷</button>
      <input type='number' onChange={event => actions.setY(event.target.valueAsNumber)} value={state.y} />
      {' '} = {doMath(state.x, state.y, state.operand)}
    </div>
  ))
