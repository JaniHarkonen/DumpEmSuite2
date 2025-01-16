import ConditionalBlock from "../meta/ConditionalBlock.js";
import LoopBlock from "./LoopBlock.js"

import { KEYWORDS } from "../../../tokenizer/tokenizer.js";
import { OPERATIONS } from "../../parser.js";


export default function RepeatLoop(target, startPosition) {
  return ConditionalBlock(target, startPosition, KEYWORDS.repeat, OPERATIONS.repeat, LoopBlock);
}
