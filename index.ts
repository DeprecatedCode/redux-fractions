import { connect as reduxConnect } from 'react-redux'
import { Component } from 'react'

interface IFluxStandardAction {
  type: string,
  error?: boolean,
  payload?: any
  meta?: object
}

/**
 * @name FractionReducers
 * @author Nate Ferrero
 * @description Type for object containing reducers
 */
export type FractionReducers<TComponentState, TComponentActions> = {
  [K in keyof TComponentActions]: ((state: TComponentState, payload?: any, error?: boolean) => Partial<TComponentState>)
}

const reducers: FractionReducers<{}, { [key: string]: any }> = {}
const initialRootState: { [key: string]: any } = {}

/**
 * @name connect
 * @author Nate Ferrero
 * @description This is complicated - we are ensuring type information can be passed through to redux
 *              { new(props: any): TComponentClass } is a constructor type signature
 */
export function connect<
  TComponentClass extends Component<TComponentState & TComponentActions & TComponentProps>,
  TComponentState,
  TComponentActions,
  TComponentProps={}
>(ComponentClass: { new(props: any): TComponentClass }, initialState: TComponentState, actions: FractionReducers<TComponentState, TComponentActions>) {
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

        if (typeof payload !== 'undefined') {
          action.payload = payload
        }

        if (typeof error !== 'undefined') {
          action.error = error
        }

        dispatch(action)
      }

      reducers[actionType] = (actions as any)[key]
    })

    return actionCreators as TComponentActions
  }

  return reduxConnect<TComponentState, TComponentActions, TComponentProps>(mapStateToProps, mapDispatchToProps)(ComponentClass)
}

/**
 * @name fractionReducer
 * @author Nate Ferrero
 * @description the root fractions reducer, to be used with redux's createStore()
 * @param rootState Current redux root state
 * @param action Action to process
 */
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
