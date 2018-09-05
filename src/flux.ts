export interface IFluxStandardAction<TPayload = void> {
  error?: boolean
  meta?: object
  payload?: TPayload
  type: string
}