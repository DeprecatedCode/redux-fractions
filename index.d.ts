import { Component } from 'react'

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
  [K in keyof TComponentActions]:
    (
      state: TComponentState,
      payload?: any,
      error?: boolean
    ) => Partial<TComponentState>
}

/**
 * @author Nate Ferrero
 * @description This is complicated - we are ensuring type information can be passed through to redux
 *              new(props: TComponentState & TComponentActions & TComponentProps): TComponentClass
 *              is a constructor type signature
 */
declare function connect<
  TComponentClass extends Component<TComponentState & TComponentActions & TComponentProps>,
  TComponentState,
  TComponentActions,
  TComponentProps = {}
>(
  ComponentClass: {
    new(props: TComponentState & TComponentActions & TComponentProps): TComponentClass
  },
  initialState: TComponentState,
  actions: FractionReducers<TComponentState, TComponentActions>
): TComponentActions

/**
 * @author Nate Ferrero
 * @description the root fractions reducer, to be used with redux's createStore()
 * @param rootState Current redux root state
 * @param action Action to process
 */
declare function fractionReducer(
  rootState: { [key: string]: object } | undefined,
  action: IFluxStandardAction
): { [key: string]: object }
