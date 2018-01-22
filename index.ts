import { connect as reduxConnect } from 'react-redux'
import { Component } from 'react'

interface IFluxStandardAction {
  type: string,
  error?: boolean,
  payload?: any
  meta?: object
}

export interface IActionReducers<TComponentState> {
  [key: string]: ((state: TComponentState, payload?: any, error?: boolean) => TComponentState)
}

const reducers: IActionReducers<{}> = {}
const initialRootState: { [key: string]: any } = {}

// This is complicated - we are ensuring type information can be passed through to redux
// Details: { new(props: any): TComponentClass } is a constructor type signature
export function connect<
  TComponentClass extends Component<TComponentState & TComponentActions>,
  TComponentState,
  TComponentActions
>(ComponentClass: { new(props: any): TComponentClass }, initialState: TComponentState, actions: IActionReducers<TComponentState>) {
  initialRootState[ComponentClass.name] = initialState

  const mapStateToProps = (state: any): TComponentState =>
    ComponentClass.name in state ? state[ComponentClass.name] : initialState

  const mapDispatchToProps = (dispatch: any) => {
    const actionCreators: {[key: string]: any} = {}

    Object.keys(actions).forEach(key => {
      const actionType = `${ComponentClass.name}:${key}`

      actionCreators[key] = (payload: any, error: boolean = false) => {
        const action: IFluxStandardAction = {
          type: actionType
        }
        if (payload) {
          action.payload = payload
        }
        if (error) {
          action.error = error
        }
        dispatch(action)
      }

      reducers[actionType] = actions[key]
    })

    return actionCreators as TComponentActions
  }

  return reduxConnect(mapStateToProps, mapDispatchToProps)(ComponentClass)
}

export function fractionReducer(rootState: { [key: string]: object }={}, action: IFluxStandardAction) {
  if (action.type.indexOf(':') === - 1) {
    return rootState
  }

  const [ namespace, name ] = action.type.split(':')

  const state = namespace in rootState ? rootState[namespace] : initialRootState[namespace]

  return {
    ...rootState,
    [namespace]: {
      ...state,
      ...reducers[action.type](state, action.payload, action.error)
    }
  }
}
