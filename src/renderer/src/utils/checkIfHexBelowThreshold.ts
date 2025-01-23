export default function checkIfHexBelowThreshold(
  colorHex: string, brightnessThreshold: number
): boolean {
  if( colorHex.charAt(0) === "#" ) {
    colorHex = colorHex.substring(1);
  }

  let opacity: string | null = null;

  if( colorHex.length !== 6 && colorHex.length !== 8 ) {
    return false;
  } else if( colorHex.length === 8 ) {
    opacity = colorHex.charAt(6) + colorHex.charAt(7);
    colorHex = colorHex.substring(0, 6);
  }

  const red: number = parseInt(colorHex.charAt(0) + colorHex.charAt(1), 16);
  const green: number = parseInt(colorHex.charAt(2) + colorHex.charAt(3), 16);
  const blue: number = parseInt(colorHex.charAt(4) + colorHex.charAt(5), 16);

  if( red < brightnessThreshold && green < brightnessThreshold && blue < brightnessThreshold ) {
    return true;
  }

  return false;
}