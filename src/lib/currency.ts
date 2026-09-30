export const USD_TO_BDT = 123;

export const formatBDT = (usdAmount: number) =>
  new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(Math.round(usdAmount * USD_TO_BDT));

export const formatBDTDiscount = (usdAmount: number) => `-${formatBDT(usdAmount)}`;
