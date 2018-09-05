import { ReactNode } from 'react'
import { Component, connect } from 'react-redux'
import { IFluxStandardAction } from './flux'

interface IReducers {
  [key: string]: (state: object, payload?: any, error?: boolean) => object
}

interface IStateType {
  [key: string]: object
}

export const reducers: IReducers = {}
export const initialRootStates: IStateType = {}

const PERSIST_TIMEOUT = 200
const lastPersistedState: IStateType = {}
let persistKey: string | undefined
let persistState: IStateType | undefined
const persist = (newRootState: IStateType) => {
  if (typeof persistKey === 'undefined') {
    return
  }

  try {
    Object.keys(newRootState)
      .forEach(key => {
        lastPersistedState[key] = newRootState[key]
      })
    localStorage.setItem(persistKey, JSON.stringify(lastPersistedState))
  }

  catch (e) {
    window.console.error(e)
    window.console.warn('fractionPersist: unable to persist state')
  }
}

/**
 * @author Nate Ferrero
 * @description basic localStorage persistence for redux-fractions
 * @param key local storage key to use for storing root state
 */
export const fractionPersist = (storageKey: string) => {
  persistKey = storageKey

  try {
    const storage = localStorage.getItem(persistKey)

    if (typeof storage !== 'string') {
      return
    }

    const data = JSON.parse(storage) as { [key: string]: any }

    Object.keys(data)
      .forEach(key => {
        initialRootStates[key] = data[key]
        lastPersistedState[key] = data[key]
      })
  }

  catch (e) { return }
}

/**
 * @author Nate Ferrero
 * @description the root fractions reducer, to be used with redux's createStore()
 * @param rootState Current redux root state
 * @param action Action to process
 */
export const fractionReducer = (
  rootState: IStateType | void = {},
  action: IFluxStandardAction<any>
) => {
  const hasColon = action.type.indexOf(':')
  if (hasColon === -1) {
    return rootState
  }

  const [stateKey, type] = action.type.split(':')
  const [namespace, uuid] = stateKey.split('.')
  const actionType = `${namespace}:${type}`

  if (typeof action.payload === 'undefined') {
    window.console.debug(`✳️ <${namespace} uuid='${atob(uuid)}'>.${type}()`)
  }

  else {
    window.console.debug(`✳️ <${namespace} uuid='${atob(uuid)}'>.${type}(`, action.payload, ')')
  }

  const state = typeof rootState === 'object' &&
    stateKey in rootState ?
    rootState[stateKey] :
    (
      stateKey in initialRootStates ?
        initialRootStates[stateKey] :
        initialRootStates[namespace]
    )

  const newRootState = {
    ...rootState,
    [stateKey]: {
      ...state,
      ...reducers[actionType](state, action.payload, action.error)
    }
  }

  if (typeof persistKey === 'string') {
    if (typeof persistState === 'undefined') {
      setTimeout(
        () => {
          if (typeof persistState !== 'undefined') {
            persist(persistState)
            persistState = undefined
          }
        },
        PERSIST_TIMEOUT
      )
    }

    persistState = newRootState
  }

  return newRootState
}

interface IActions {
  [K: string]: any
}

interface IProps {
  [K: string]: any
}

interface IUUIDProp { uuid: string | number }

type TActionsImplementation<TState, TActions extends IActions> = {
  [K in keyof TActions]: TActions[K] extends void ?
  (state: TState) => Partial<TState> :
  (payload: TActions[K], state: TState) => Partial<TState>
}

type TActionsDispatch<TActions extends IActions> = {
  [K in keyof TActions]: TActions[K] extends void ?
  () => void :
  (payload: TActions[K]) => void
}

interface IInitialComponent {
  props<TProps extends IProps>(): IComponentWithProps<TProps>
  render(renderer: (children?: ReactNode) => JSX.Element | null): Component<{}>
  state<TState>(initialState: TState): IComponentWithState<TState>
}

interface IComponentWithState<TState> {
  actions<TActions extends IActions>(
    componentActions: TActionsImplementation<TState, TActions>
  ): IComponentWithStateActions<TState, TActions>
}

interface IComponentWithStateActions<TState, TActions extends IActions> {
  render(
    renderer: (state: TState, actions: TActionsDispatch<TActions>, children?: ReactNode) => JSX.Element | null
  ): Component<IUUIDProp>
}

interface IComponentWithProps<TProps> {
  render(renderer: (props: TProps, children?: ReactNode) => JSX.Element | null): Component<TProps>
  state<TState>(initialState: TState): IComponentWithPropsState<TProps, TState>
}

interface IComponentWithPropsState<TProps, TState> {
  actions<TActions>(
    componentActions: TActionsImplementation<TState, TActions>
  ): IComponentWithPropsStateActions<TProps, TState, TActions>
}

interface IComponentWithPropsStateActions<TProps extends IProps, TState, TActions extends IActions> {
  render(
    renderer: (
      props: TProps & IUUIDProp,
      state: TState,
      actions: TActionsDispatch<TActions>,
      children?: ReactNode
    ) => JSX.Element | null
  ): Component<TProps & IUUIDProp>
}

const getMapStateToProps = <IState>(name: string) =>
  (state: IState, ownProps: IUUIDProp) => {
    const stateKey = `${name}.${'uuid' in ownProps ? btoa(String(ownProps.uuid)) : 'all'}`

    return ({
      state: stateKey in state ?
        (state as any)[stateKey] :
        (
          stateKey in initialRootStates ?
            initialRootStates[stateKey] :
            initialRootStates[name]

        )
    })
  }

const getMapDispatchToProps = <
  TState, TActions extends IActions
  >(name: string, componentActions: TActionsImplementation<TState, TActions>) =>
  (dispatch: any, ownProps: IUUIDProp) => {
    const actionCreators: any = {}

    Object.keys(componentActions)
      .forEach(key => {
        const stateKey = `${name}.${'uuid' in ownProps ? btoa(String(ownProps.uuid)) : 'all'}`

        actionCreators[key] = (payload: any, error: boolean = false) => {
          const action: IFluxStandardAction = {
            error,
            payload,
            type: `${stateKey}:${key}`
          }

          dispatch(action)
        }

        const actionKey = `${name}:${key}`
        if (!(actionKey in reducers)) {
          reducers[actionKey] = (state, payload, error) => {
            const reducer = componentActions[key] as any

            return typeof payload === 'undefined' ?
              reducer(state, error) :
              reducer(payload, state, error)
          }
        }
      })

    return { actions: actionCreators as TActionsDispatch<TActions> }
  }

/**
 * @author Nate Ferrero
 * @description redux-fractions component
 * @param name component name used to namespace state
 */
export const component = (name: string): IInitialComponent => ({
  props<TProps extends IProps>() {
    return {
      state<TState>(initialState: TState) {
        initialRootStates[name] = initialState as any

        return {
          actions<TActions>(componentActions: TActionsImplementation<TState, TActions>) {
            return {
              render(renderer: any) {
                return connect<
                  { state: TState },
                  { actions: TActionsDispatch<TActions> },
                  TProps & IUUIDProp,
                  TState
                  >(
                    getMapStateToProps<TState>(name),
                    getMapDispatchToProps<TState, TActions>(name, componentActions),
                    undefined,
                    { getDisplayName: () => `Fraction:${name}` }
                  )(
                    ({ state, actions, children, ...props }) => renderer(props, state, actions, children)
                  ) as any
              }
            }
          }
        }
      },
      render(renderer) {
        return ({ children, ...props }: { children?: ReactNode }) => renderer(props as any, children)
      }
    }
  },
  state<TState>(initialState: TState) {
    initialRootStates[name] = initialState as any

    return {
      actions<TActions extends IActions>(componentActions: TActionsImplementation<TState, TActions>) {
        return {
          render(renderer: (state: TState, actions: TActions, children: ReactNode) => JSX.Element | null) {
            return connect<
              { state: TState },
              { actions: TActionsDispatch<TActions> },
              IUUIDProp,
              TState
              >(
                getMapStateToProps<TState>(name),
                getMapDispatchToProps<TState, TActions>(name, componentActions),
                undefined,
                { getDisplayName: () => `Fraction:${name}` }
              )(
                ({ state, actions, children }) => renderer(state, actions, children)
              )
          }
        }
      }
    }
  },
  render(renderer) {
    return ({ children }: { children?: ReactNode }) => renderer(children)
  }
})

const SAFE_ACTION_TIMEOUT = 15
const safeActionTimers: { [key: string]: number } = {}

export const requestSafeAction = (uuid: string | number, action: () => void) => {
  clearTimeout(safeActionTimers[String(uuid)])
  safeActionTimers[String(uuid)] = setTimeout(action, SAFE_ACTION_TIMEOUT)
}
