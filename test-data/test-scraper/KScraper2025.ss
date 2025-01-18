import { getArgument, print, floor, round, ceil, random, sqrt, max, min, abs, sign, clamp, indexOf, lastIndexOf, substring, length, parseNumber, parseBoolean, push, pop, remove, insert, shift, unshift, concat, replace, replaceAll, split, typeOf, isNaN, keys, stringify, includes, combine, stringify, timeNow } from "./STD.js";

function findNextTag(str, start, tag, nth) {
  let cursorPosition = start;

  for( let i = 0; i < nth; i++ )
  {
    cursorPosition = indexOf(str, tag, cursorPosition) + 1;
    
    if( cursorPosition - 1 < 0 )
    {
      return {
        tagPosition: -1,
        cursorPosition: -1
      };
    }
  }

  return {
    tagPosition: cursorPosition - 1,
    cursorPosition: cursorPosition - 1 + length(tag)
  };
};


function copyBetweenTags(str, start, startTag, endTag) {
  let startCursorPosition = start;

  if( typeOf(startTag) == "array" )
  {
    for( let i = 0; i < length(startTag); i++ )
    {
      const tag = startTag[i];
      const nextTag = findNextTag(str, startCursorPosition, tag, 1);
      startCursorPosition = nextTag.cursorPosition;
      
      if( startCursorPosition < 0 )
      { break; }
    }
  }
  else
  {
    const nextStartTag = findNextTag(str, startCursorPosition, startTag, 1);
    startCursorPosition = nextStartTag.cursorPosition;
  }

  if( startCursorPosition < 0 )
  { return { copiedString: null }; }

  let nextTag = findNextTag(str, startCursorPosition, endTag, 1);
  let copiedString = substring(str, startCursorPosition, nextTag.tagPosition);

  return {
    copiedString: copiedString,
    cursorPosition: nextTag.cursorPosition
  };
}

function copyNumericTableValue(str, start, maxAttempts) {
  let attempts = 0;
  let result = '';
  let startCursorPosition = start;

  while( true ) {
    let betweenTags = copyBetweenTags(str, startCursorPosition, '>', '<');

    if( betweenTags.copiedString == '' ) {
      startCursorPosition = lastIndexOf(str, '<span class="', startCursorPosition - 2);
      continue;
    }

    result += betweenTags.copiedString;

    const end = findNextTag(str, betweenTags.cursorPosition, '>', 1);
    startCursorPosition = end.cursorPosition;
    attempts++;

      // Contains a comma -> must be the decimal point -> must be the end of volume
    if( indexOf(betweenTags.copiedString, ',', 0) >= 0 ) {
      break;
    }

    if( attempts >= maxAttempts ) {
      return {
        wasSuccessful: false,
        cursorPosition: startCursorPosition
      };
    }
  }

  return {
    wasSuccessful: true,
    cursorPosition: startCursorPosition,
    value: result,
  };
}

const INPUT = getArgument(0);
const output = {
  symbols: [],
  errors: []
};

let cursor = indexOf(INPUT, "Päivitetty", 1);
let copy = null;
const tag = '/porssi/porssikurssit/osake/';
while( true ) {
  let stockSymbol = '';
  let companyName = '';
  let pricePerShare = '';
  let volumePrice = '';
  let volume = '';
  let updateTimestamp = '';

  copy = copyBetweenTags(INPUT, cursor, tag, '"');
  
  if( copy.copiedString == null ) {
    break;
  }

    // TICKER
  stockSymbol = copy.copiedString;
  cursor = copy.cursorPosition;

    // NAME
  copy = copyBetweenTags(INPUT, cursor, ['>', '>'], '<');
  companyName = copy.copiedString;
  cursor = copy.cursorPosition;

    // UPDATED
  copy = copyBetweenTags(INPUT, cursor, '<time>', '<');
  updateTimestamp = copy.copiedString;
  cursor = copy.cursorPosition;

    // SHARE PRICE
  copy = copyBetweenTags(INPUT, cursor, ['<span class="', '>'], '<');
  pricePerShare = copy.copiedString;
  cursor = copy.cursorPosition;

  const nextColumn = findNextTag(INPUT, cursor, '<span class="', 1);
  cursor = nextColumn.cursorPosition;

  let skipCount = 3;

  if( substring(INPUT, cursor, cursor + 6) == 'thinsp' ) {
    skipCount = 4;
  }

  const columnSkip = findNextTag(INPUT, cursor, '<span class="', skipCount);
  cursor = columnSkip.cursorPosition;

    // VOLUME (quantity)
  copy = copyNumericTableValue(INPUT, cursor, 10);
  cursor = copy.cursorPosition;
  volume = copy.value;

  if( copy.wasSuccessful == false ) {
    push(output.errors, "ERROR: Unable to scrape the 'volume_quantity' information of stock: '" + companyName + "' at index: " + length(output.symbols));
    volume = 0;
  }

  const skipToVolumePrice = findNextTag(INPUT, cursor, '<span class="', 1);
  cursor = skipToVolumePrice.cursorPosition;

    // VOLUME (price)
  copy = copyNumericTableValue(INPUT, cursor, 10);
  cursor = copy.cursorPosition;
  volumePrice = copy.value;

  if( copy.wasSuccessful == false ) {
    push(output.errors, "ERROR: Unable to scrape the 'volume_price' information of stock: '" + companyName + "' at index: " + length(output.symbols));
    volumePrice = 0;
  }

      // Symbol has been scraped -> push
  const fixedStockPrice = parseNumber(replace(pricePerShare, ",", "."));
  const fixedVolume = parseNumber(replace(volume, ",", "."));
  const fixedVolumePrice = parseNumber(replace(volumePrice, ",", "."));
  const symbol = {
    company_name: companyName,
    stock_ticker: stockSymbol,
    stock_price: fixedStockPrice,
    volume_price: fixedVolumePrice,
    volume_quantity: fixedVolume,
    exchange: "OMXHEX",
    updated: updateTimestamp
  };

  push(output.symbols, symbol);
}

yield output;
