import { Component, ComponentClass, StatelessComponent } from 'react'
import { connect as reduxConnect } from 'react-redux'

export interface IFluxStandardAction {
  error?: boolean
  meta?: object
  payload?: any
  type: string
}

/**
 * @author Nate Ferrero
 * @description Type for object containing reducers
 */
export type FractionReducers<TComponentState, TComponentActions> = {
  [K in keyof TComponentActions]: ((state: TComponentState, payload?: any, error?: boolean) => Partial<TComponentState>)
}

const reducers: FractionReducers<{}, { [key: string]: object }> = {}
const initialRootStates: { [key: string]: object } = {}

/**
 * @author Nate Ferrero
 * @description This is complicated - we are ensuring type information can be passed through to redux
 *              new(props: TComponentState & TComponentActions & TComponentProps): TComponentClass
 *              is a constructor type signature
 */
export const connect = <
  TComponentClass extends Component<TComponentState & TComponentActions & TComponentProps>,
  TComponentState,
  TComponentActions,
  TComponentProps = {}
>(
  name: string,
  ComponentReference: (() => JSX.Element | null) | {
    new(props: TComponentState & TComponentActions & TComponentProps): TComponentClass
  },
  initialState: TComponentState,
  actions: FractionReducers<TComponentState, TComponentActions>
) => {
  initialRootStates[name] = initialState as any

  const mapStateToProps = (state: { [key: string]: object }): TComponentState =>
    name in state ? state[name] as any : initialState

  const mapDispatchToProps = (dispatch: any) => {
    const actionCreators: any = {}

    Object.keys(actions)
      .forEach(key => {
        const actionType = `${name}:${key}`

        actionCreators[key] = (payload: any, error: boolean = false) => {
          const action: IFluxStandardAction = {
            type: actionType
          }

          if (typeof payload !== 'undefined') {
            action.payload = payload
          }

          if (error) {
            action.error = error
          }

          dispatch(action)
        }

        reducers[actionType] = (actions as any)[key]
      })

    return actionCreators as TComponentActions
  }

  return reduxConnect<TComponentState, TComponentActions, TComponentProps>(
    mapStateToProps,
    mapDispatchToProps
  )(ComponentReference)
}

/**
 * @author Nate Ferrero
 * @description the root fractions reducer, to be used with redux's createStore()
 * @param rootState Current redux root state
 * @param action Action to process
 */
export const fractionReducer = (
  rootState: { [key: string]: object } | void = {},
  action: IFluxStandardAction
) => {
  if (action.type.indexOf(':') === - 1) {
    return rootState
  }

  const [ namespace ] = action.type.split(':')

  const state = typeof rootState === 'object' &&
    namespace in rootState ?
      rootState[namespace] :
      initialRootStates[namespace]

  return {
    ...rootState,
    [namespace]: {
      ...state,
      ...reducers[action.type](state, action.payload, action.error)
    }
  }
}

// interface IMyComponentState {
//   foo: boolean
// }

// interface IMyComponentActions {
//   setFoo(foo: boolean): void
// }

// const myComponentActions: FractionReducers<IMyComponentState, IMyComponentActions> = {
//   setFoo: (state: IMyComponentState, foo: boolean) => ({ foo })
// }

// const MyComponent = () => null // tslint:disable-line:no-null-keyword

// connect('MyComponent', MyComponent, { foo: false }, myComponentActions)
