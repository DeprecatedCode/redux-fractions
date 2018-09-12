import * as React from 'react' // tslint:disable-line:no-implicit-dependencies
import { component } from '../../src'

export const HelloApp = component('HelloApp')
  .props<{
    planet: string
  }>()

  .state<{
    name: string
  }>({
    name: 'human'
  })

  .actions<{
    setName: string
  }>({
    setName: name => ({ name })
  })

  .render((props, state, actions) => (
    <div>
      <label>Enter your name:</label>
      <p>
        <input
          type='text'
          onChange={event => actions.setName(event.target.value)}
          value={state.name}
        />
      </p>
      <p>
        Hello, {state.name} from planet {props.planet}!
      </p>
    </div>
  ))
