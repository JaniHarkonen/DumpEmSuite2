export default function roundDecimals(value: number, decimalAccuracy: number) {
  return Math.round(value * Math.pow(10, decimalAccuracy)) / 100;
}