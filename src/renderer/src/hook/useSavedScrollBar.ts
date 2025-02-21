import { TabsContext } from "@renderer/context/TabsContext";
import { Tab } from "@renderer/model/tabs";
import debounce from "@renderer/utils/debounce";
import { MutableRefObject, useContext, useEffect } from "react";


type ScrollPosition = {
  scrollX: number;
  scrollY: number;
}; 

type Props = {
  scrollBarID: string;
  scrolledElementRef: MutableRefObject<HTMLElement | null>;
};

type Returns = [(e: React.UIEvent<HTMLElement, UIEvent>) => void];

export default function useSavedScrollBar(props: Props): Returns {
  const pScrollBarID: string = props.scrollBarID;
  const pScrolledElementRef: MutableRefObject<HTMLElement | null> = props.scrolledElementRef;

  const {tabs, activeTabIndex, setExtraInfo} = useContext(TabsContext);

  const activeTab: Tab | undefined = tabs[activeTabIndex];

  useEffect(() => {
    setTimeout(() => {
      if( activeTab && activeTab.extra && pScrolledElementRef.current ) {
        const scrollPosition: ScrollPosition | undefined = activeTab.extra[pScrollBarID];
  
        if( scrollPosition ) {
          pScrolledElementRef.current.scrollTo(scrollPosition.scrollX, scrollPosition.scrollY);
        }
      }
    }, 100);
  }, [pScrolledElementRef.current]);

  const handleScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    const htmlTarget: HTMLElement = e.target as HTMLElement;
    setExtraInfo && setExtraInfo({
      [pScrollBarID]: {
        scrollX: htmlTarget.scrollLeft,
        scrollY: htmlTarget.scrollTop
      }
    });
  };

  return [debounce(handleScroll, 100)];
}
