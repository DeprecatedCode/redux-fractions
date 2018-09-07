export type TLiquidUnit = 'gallon' | 'liter'

export const LiquidUnitPlural = {
  gallon: 'gallons',
  liter: 'liters'
}

export const LiquidUnitAbbreviation = {
  gallon: 'g',
  liter: 'l'
}

export const LiquidUnitRelativeMeasure = {
  gallon: 1,
  liter: 3.78541178
}

export const convertLiquidQuantity = (
  q: number,
  from: TLiquidUnit,
  to: TLiquidUnit
) => {
  return (q * LiquidUnitRelativeMeasure[to]) / LiquidUnitRelativeMeasure[from]
}
