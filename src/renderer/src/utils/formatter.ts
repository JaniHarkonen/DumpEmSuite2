export function milleFormatter(numberString: string): string {
  if( numberString === "NaN" ) {
    return numberString;
  }

  const split = numberString.split(".");
  let whole: string = split[0];
  let fixedWhole: string = "";
  
  for( let i = whole.length; i >= 0; i -= 3 ) {
    const triple: string = whole.substring(i - 3, i);
    fixedWhole = ((triple.length === 3 && i != 3) ? "," : "") + triple + fixedWhole;
  }

  return fixedWhole + (split[1] ? "." + split[1] : "");
}

export function decimalFormatter(numberString: string): string {
  if( numberString === "NaN" ) {
    return numberString;
  }

  const split = numberString.split(".");
  let decimal: string = split[1] || "";

  if( decimal.length === 1 ) {
    decimal += "0";
  } else if( decimal.length === 0 ) {
    decimal += "00";
  }

  return split[0] + "." + decimal;
}

export function priceFormatter(currencySymbol: string, numberString: string): string {
  return currencySymbol + decimalFormatter(milleFormatter(numberString));
}
