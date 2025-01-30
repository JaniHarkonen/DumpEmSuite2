export default function compoundInterest(
  principal: number, interestRate: number, termCount: number
) {
  let compound: number = principal;

  for( let i = 0; i < termCount; i++ ) {
    compound += principal * Math.pow(interestRate, termCount - i);
  }

  return compound;
}
