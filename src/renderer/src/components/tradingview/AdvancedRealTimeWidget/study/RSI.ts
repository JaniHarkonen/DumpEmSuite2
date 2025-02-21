import { TradingViewStudy } from "./study.type";


export default function RSI(length: number): TradingViewStudy {
  return {
    id: "RSI@tv-basicstudies",
		inputs: {
			length: length
		}
  };
}
