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
export type Reducer<TState, TActions> = {
  [K in keyof TActions]: ((state: TState, payload?: any, error?: boolean) => Partial<TState>)
}

/**
 * @author Nate Ferrero
 * @description Type for stateless rendered component
 */
export type Renderer<TState, TActions, TProps> = (
  state: TState,
  actions: TActions,
  props: TProps
) => JSX.Element | null

const reducers: Reducer<{}, { [key: string]: object }> = {}
const initialRootStates: { [key: string]: object } = {}

/**
 * @author Nate Ferrero
 * @description This is complicated - we are ensuring type information can be passed through to redux
 */
export const connect = <
  TState,
  TActions,
  TProps
  >(
    renderer: Renderer<TState, TActions, TProps>,
    initialState: TState,
    actionDefinitions: Reducer<TState, TActions>
  ) => {
  const name = (renderer as any).name

  initialRootStates[name] = initialState as any

  const mapStateToProps = (state: { [key: string]: object }): { state: TState } =>
    ({ state: name in state ? state[name] as any : initialState })

  const mapDispatchToProps = (dispatch: any) => {
    const actionCreators: any = {}

    Object.keys(actionDefinitions)
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

        reducers[actionType] = (actionDefinitions as any)[key]
      })

    return { actions: actionCreators as TActions }
  }

  return reduxConnect<{ actions: TActions, props: TProps, state: TState }, { actions: TActions}, TProps>(
    mapStateToProps as any,
    mapDispatchToProps as any
  )(({ actions, state, ...props }: any) => renderer(state, actions, props))
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

  const [namespace] = action.type.split(':')

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
