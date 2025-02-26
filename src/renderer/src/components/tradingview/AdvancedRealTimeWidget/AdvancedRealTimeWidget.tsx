
import "./AdvancedRealTimeWidget.css";

import useTabKeys from '@renderer/hook/useTabKeys';
import useTheme from '@renderer/hook/useTheme';
import { useEffect, memo, useState } from 'react';
import { ASSETS } from "@renderer/assets/assets";
import StyledIcon from "@renderer/components/StyledIcon/StyledIcon";
import MACD from "./study/MACD";
import RSI from "./study/RSI";
import MAExponential from "./study/MAExponential";
import useDocumentHotkeys from "@renderer/hook/useDocumentHotkeys";


type Props = {
  exchange: string;
  ticker: string;
  allowFullscreen?: boolean;
  containerID?: string;
};

export type AdvancedRealTimeWidgetProps = Props;

const STUDIES = [
  MACD(),
  RSI(14),
  MAExponential(50),
  MAExponential(100),
  MAExponential(200),
];

  // This will be dynamically imported from the TradingView CDN
declare const TradingView: any;

function AdvancedRealTimeWidget(props: Props) {
  const pExchange: string = props.exchange;
  const pTicker: string = props.ticker;
  const pAllowFullscreen: boolean = props.allowFullscreen ?? true;
  const pContainerID: string | undefined = props.containerID;

  const {activeTheme, theme} = useTheme();
  const {formatKey} = useTabKeys();

  const [fullscreen, setFullscreen] = useState<boolean>(false);

  const containerID: string = (
    pContainerID || 
    formatKey("trading-view-advanced-real-time-widget-" + pExchange + "_" + pTicker)
  );

  useEffect(() => {
    // @ts-ignore: Ignoring because the external module doesn't exist in the project
    import("https://s3.tradingview.com/tv.js").then(() => {
        // Because the TradingView script will always create a new style on load, we have to 
        // remove the previous style, if it exists
      for( let element of document.getElementsByTagName("style") ) {
        if( element.innerHTML.startsWith(".tradingview-widget-copyright") ) {
          element.remove();
          break;
        }
      }

      new TradingView.widget({
        autosize: true,
        symbol: pExchange + ":" + pTicker,
        interval: "D",
        timezone: "Etc/UTC",
        theme: activeTheme,
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: true,
        hide_side_toolbar: false,
        show_popup_button: true,
        container_id: containerID,
        studies: STUDIES
      });

    });
  }, [pExchange, pTicker, activeTheme]);

  useDocumentHotkeys({ actionMap: {
    "blur": () => setFullscreen(false),
  }});
  
  return (
    <div
      {...theme("ambient-bgc", "advanced-real-time-widget")}
      style={fullscreen ? {
        position: "fixed",
        top: "0px",
        left: "0px",
        width: "100%",
        height: "100%",
        zIndex: 2
      } : {}}
    >
      <div id={containerID} /> {/* <-- THE WIDGET GOES HERE */}

      <div className="advanced-real-time-widget-bottom">
        <div className="tradingview-widget-copyright">
          <a
            href="https://www.tradingview.com/"
            rel="noopener" 
            target="_blank"
          >
            <span className="blue-text">Track all markets on TradingView</span>
          </a>
        </div>
        {pAllowFullscreen && (
          <StyledIcon
            iconSize="advanced-real-time-widget-fullscreen"
            src={ASSETS.icons.action.fullscreen.black}
            onClick={() => pAllowFullscreen && setFullscreen(!fullscreen)}
          />
        )}
      </div>
    </div>
  );
}

export default memo(AdvancedRealTimeWidget);
