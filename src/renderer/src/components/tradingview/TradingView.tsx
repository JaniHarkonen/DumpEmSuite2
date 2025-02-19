import { useEffect, useRef } from "react";

declare const TradingView;

export default function TradingViewWidget(props) {
	const symbol = props.symbol;

  const onLoadScriptRef = useRef();

  const studies = [
	];

  useEffect(() => {
    function createWidget() {
      if (document.getElementById('tradingview_f4e96') && 'TradingView' in window) {
        new TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: "D",
          timezone: "Etc/UTC",
          // theme: theme,
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          hide_side_toolbar: false,
          container_id: "tradingview_f4e96",
          studies: [{id: "MAExp@tv-basicstudies", inputs: {length: 50}}]
        });
      }
    }
      onLoadScriptRef.current = createWidget;

      new Promise((resolve) => {
        const script = document.createElement('script');
        script.id = 'tradingview-widget-loading-script';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.type = 'text/javascript';
        script.onload = resolve;

        document.head.appendChild(script);
      }).then(() => onLoadScriptRef.current && onLoadScriptRef.current());

      return () => onLoadScriptRef.current = null;
  }, []);

	return (
		<div className='w-100 h-100'>
			<div id='tradingview_f4e96' className="w-100 h-100"/>
			<div className="tradingview-widget-copyright">
				<a
          href="https://www.tradingview.com/"
          rel="noopener" 
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a> by TradingView
			</div>
		</div>
	);
}