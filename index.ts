import { connect as reduxConnect } from 'react-redux'
import { Component } from 'react'

// This is complicated - we are ensuring type information can be passed through to redux
// Details: { new(): TComponentClass } is a constructor type signature
export function connect<
  TComponent extends Component<TComponentState & TComponentActions>,
  TComponentState,
  TComponentActions
>(ComponentClass: { new(props: any): TComponent }, intialState: TComponentState, actions: object) {

  const mapStateToProps = (state: any): TComponentState =>
    ComponentClass.name in state ? state[ComponentClass.name] : intialState

  const mapDispatchToProps = (dispatch: any) => {
    return {}
  }

  return reduxConnect(mapStateToProps, mapDispatchToProps)(ComponentClass)
}
