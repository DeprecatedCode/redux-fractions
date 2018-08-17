import { connect as reduxConnect } from 'react-redux'

export interface IFluxStandardAction<TPayload = void> {
  error?: boolean
  meta?: object
  payload?: TPayload
  type: string
}

interface IState { [key: string]: object }

export interface IComponent {
  actions: {
    [key: string]: any
  }
  data: IData
  props: object
  state: object
}

export interface IComponentArgument<
  TComponent extends IComponent
  > {
  actions: {
    [K in keyof TComponent['actions']]:
    TComponent['actions'][K] extends void ?
    () => void : (payload: TComponent['actions'][K]) => void
  }
  data: {
    [K in keyof TComponent['data']]: {
      error: boolean
      loading: boolean
      ready: boolean
      value?: TComponent['data'][K]['type']
    }
  }
  props: TComponent['props']
  state: TComponent['state']
}

/**
 * @author Nate Ferrero
 * @description Fraction Component
 */
export interface IComponentImplementation<
  TComponent extends IComponent
  > {
  reducers: {
    [K in keyof TComponent['actions']]: (
      (
        state: TComponent['state'],
        payload: TComponent['actions'][K],
        error?: boolean
      ) => Partial<TComponent['state']>
    )
  }
  state: TComponent['state']

  render(component: IComponentArgument<TComponent>, dataSource?: TDataSource<TComponent['data']>): JSX.Element | null
}

const reducers: { [key: string]: (state: object, payload?: any, error?: boolean) => object } = {}
const initialRootStates: IState = {}

/**
 * @author Nate Ferrero
 * @description Connect a renderer, initial state, and action definitions, and optionally specify a name
 */
export const connect = <
  TComponent extends IComponent
  >(
    name: string,
    component: IComponentImplementation<TComponent>
  ) => {
  initialRootStates[name] = component.state

  const mapStateToProps = (state: IState): { state: TComponent['state'] } =>
    ({ state: name in state ? state[name] as any : component.state })

  const mapDispatchToProps = (dispatch: any) => {
    const actionCreators: any = {}

    Object.keys(component.reducers)
      .forEach(key => {
        const actionType = `${name}:${key}`

        actionCreators[key] = (payload: any, error: boolean = false) => {
          const action: IFluxStandardAction = {
            error,
            payload,
            type: actionType
          }

          dispatch(action)
        }

        reducers[actionType] = (component.reducers as any)[key]
      })

    return { actions: actionCreators as TComponent['actions'] }
  }

  const data = {} as any

  return reduxConnect<{
    actions: TComponent['actions'],
    props: TComponent['props'],
    state: TComponent['state']
  }, { actions: TComponent['actions'] }, TComponent['props'] & { dataSource: TDataSource<TComponent['data']> }>(
    mapStateToProps as any,
    mapDispatchToProps as any,
    undefined,
    { getDisplayName: () => `Fraction:${name}` }
  )(
    ({ actions, state, dataSource, ...props }: any) => {
      dataSource.connect(data)

      return component.render(
        { actions, data, props, state },
        dataSource
      )
    }
  )
}

/**
 * @author Nate Ferrero
 * @description the root fractions reducer, to be used with redux's createStore()
 * @param rootState Current redux root state
 * @param action Action to process
 */
export const fractionReducer = (
  rootState: IState | void = {},
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

export interface IData {
  [key: string]: { type: any }
}

export type TDataSource<TData> = {
  [K in keyof TData]: () => void
}

export type TDataValues<TData extends IData> = {
  [K in keyof TData]: TData[K]['type']
}

export const createDataSource = <TData extends IData>(
  configuration: TDataValues<TData>
): TDataSource<TData> => {
  const dataReferences = new WeakSet<object>()
  const source: TDataSource<TData> = {
    connect: (data: { [key: string]: any }) => {
      dataReferences.add(data)
      Object.keys(configuration)
        .forEach(key => {
          if (!(key in data)) {
            data[key] = {
              error: false,
              loading: false,
              ready: false,
              value: undefined
            }
          }
        })
    }
  } as any

  Object.keys(configuration)
    .forEach(key => {
      source[key] = () => void 0
    })

  return source
}
