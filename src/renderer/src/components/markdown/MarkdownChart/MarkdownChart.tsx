import "./MarkdownChart.css";

import AdvancedRealTimeWidget, { AdvancedRealTimeWidgetProps } from "@renderer/components/tradingview/AdvancedRealTimeWidget";
import { ReactNode } from "react";


export default function MarkdownChart(props: AdvancedRealTimeWidgetProps): ReactNode {
  const pExchange: string = props.exchange;
  const pTicker: string = props.ticker;

  return (
    <div className="markdown-chart">
      <div className="markdown-chart-container">
        <AdvancedRealTimeWidget
          exchange={pExchange}
          ticker={pTicker}
        />
      </div>
    </div>
  );
}
