export type TradingViewWidgetContext = {
  TradingView: any;
};

type Returns = {
  createWidget: (
    containerID: string, 
    callback: (context: TradingViewWidgetContext) => void
  ) => void;
};

declare const TradingView: any;

export default function useTradingViewWidgets(): Returns {
  const createWidget = (containerID: string, callback: (context: TradingViewWidgetContext) => void) => {
    new Promise<void>((resolve) => {
      if( !document.getElementById("tradingview-widget-loading-script") ) {
        const script = document.createElement('script');
        script.id = 'tradingview-widget-loading-script';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.type = 'text/javascript';
        script.onload = () => resolve();

        document.head.appendChild(script);
      } else {
        resolve();
      }
    }).then(() => {
      for( let element of document.getElementsByTagName("style") ) {
        if( element.innerHTML.startsWith(".tradingview-widget-copyright") ) {
          element.remove();
          break;
        }
      }

      if( document.getElementById(containerID) && 'TradingView' in window ) {
        callback({ TradingView });
      }
    });
  };

  return {
    createWidget
  };
}
