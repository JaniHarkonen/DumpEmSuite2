import "./MarkdownChart.css";

import AdvancedRealTimeWidget, { AdvancedRealTimeWidgetProps } from "@renderer/components/tradingview/AdvancedRealTimeWidget/AdvancedRealTimeWidget";
import { ReactNode } from "react";


type Props = {
  id: string;
} & AdvancedRealTimeWidgetProps;

export default function MarkdownChart(props: Props): ReactNode {
  const pExchange: string = props.exchange;
  const pTicker: string = props.ticker;
  const pID: string = props.id;

  return (
    <div className="markdown-chart">
      <div className="markdown-chart-container">
        <AdvancedRealTimeWidget
          exchange={pExchange}
          ticker={pTicker}
          containerID={pID}
          allowFullscreen={false}
        />
      </div>
    </div>
  );
}
