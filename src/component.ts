import { ReactNode } from 'react'
import { connect, Component } from 'react-redux'

import { IFluxStandardAction } from './flux'
import { reducers, initialRootStates } from '../src'

interface IActions {
  [K: string]: any
}

interface IProps {
  [K: string]: any
}

type TUUIDProp = { uuid: string | number }

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
  props: <TProps extends IProps>() => IComponentWithProps<TProps>
  state: <TState>(initialState: TState) => IComponentWithState<TState>
  render: (renderer: (children?: ReactNode) => JSX.Element | null) => Component<{}>
}

interface IComponentWithState<TState> {
  actions: <TActions extends IActions>(componentActions: TActionsImplementation<TState, TActions>) => IComponentWithStateActions<TState, TActions>
}

interface IComponentWithStateActions<TState, TActions extends IActions> {
  render: (renderer: (state: TState, actions: TActionsDispatch<TActions>, children?: ReactNode) => JSX.Element | null) => Component<TUUIDProp>
}

interface IComponentWithProps<TProps> {
  state: <TState>(initialState: TState) => IComponentWithPropsState<TProps, TState>
  render: (renderer: (props: TProps & TUUIDProp, children?: ReactNode) => JSX.Element | null) => Component<TProps>
}

interface IComponentWithPropsState<TProps, TState> {
  actions: <TActions>(componentActions: TActionsImplementation<TState, TActions>) => IComponentWithPropsStateActions<TProps, TState, TActions>
}

interface IComponentWithPropsStateActions<TProps extends IProps, TState, TActions extends IActions> {
  render: (renderer: (props: TProps & TUUIDProp, state: TState, actions: TActionsDispatch<TActions>, children?: ReactNode) => JSX.Element | null) => Component<TProps & TUUIDProp>
}

const getMapStateToProps = <IState>(name: string) =>
  (state: IState, ownProps: TUUIDProp) => {
    const stateKey = `${name}.${'uuid' in ownProps ? btoa(String(ownProps.uuid)) : 'all'}`

    return ({ state: stateKey in state ? state[stateKey] : initialRootStates[name] })
  }

const getMapDispatchToProps = <TState, TActions extends IActions>(name: string, componentActions: TActionsImplementation<TState, TActions>) => {
  return (dispatch: any, ownProps: TUUIDProp) => {
    const actionCreators: any = {}

    Object.keys(componentActions)
      .forEach(key => {
        const stateKey = `${name}.${'uuid' in ownProps ? btoa(String(ownProps.uuid)) : 'all'}`

        if (!(key in actionCreators)) {
          actionCreators[key] = (payload: any, error: boolean = false) => {
            const action: IFluxStandardAction = {
              error,
              payload,
              type: `${stateKey}:${key}`
            }

            dispatch(action)
          }
        }

        reducers[`${name}:${key}`] = (state, payload, error) => {
          const reducer = componentActions[key] as any
          return typeof payload === 'undefined' ?
            reducer(state, error) :
            reducer(payload, state, error)
        }
      })

    return { actions: actionCreators as TActionsDispatch<TActions> }
  }
}

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
                  TProps & TUUIDProp,
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
              TUUIDProp,
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
