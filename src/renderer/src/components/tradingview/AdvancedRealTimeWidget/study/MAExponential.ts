import { TradingViewStudy } from "./study.type";


export default function MAExponential(length: number): TradingViewStudy {
  return {
    id: "MAExp@tv-basicstudies",
    inputs: {
      length: length,
      source: "close"
    }
  };
}
