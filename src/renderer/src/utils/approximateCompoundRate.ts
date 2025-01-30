import geometricSeries from "./compoundInterest";

export default function approximateCompoundRate(
  firstTerm: number, finalTerm: number, termCount: number, minimumDistance: number
): number {
  let left: number = 0;
  let right: number = finalTerm;
  let rate: number = finalTerm;

  if( firstTerm === finalTerm ) {
    return 0;
  }

  if( isNaN(firstTerm) || isNaN(finalTerm) || isNaN(termCount) || isNaN(minimumDistance) ) {
    return 0;
  }

    // Binary search for the common ratio
  while( right - left > minimumDistance ) {

    const mid: number = left + ((right - left) / 2);
    let guess: number = geometricSeries(firstTerm, mid, termCount);

    if( guess > finalTerm ) {
      right = mid;
    } else if( guess === finalTerm ) {
      return mid;
    } else {
      left = mid;
    }

    rate = mid;
  }

  return rate;
}
