import { ViewEventListenerContext } from "@renderer/context/ViewEventListenerContext";
import removeArrayIndex from "@renderer/utils/removeArrayIndex";
import { useContext } from "react";
import { WorkspaceContext } from "@renderer/context/WorkspaceContext";
import { ViewEvent } from "@renderer/model/viewEvents";


type ViewEventListenerMap = {
  [key in string]: ViewEventListener[];
};

type ViewEventListener = (result: any, eventKey: string, workspaceID: string) => void;

  // Maps listeners to event keys to workspaces
export type ViewEventListenerWorkspaceMap = {
  [key in string]: ViewEventListenerMap;
};

type Returns = {
  subscribe: (eventKey: ViewEvent, listener: ViewEventListener) => void;
  unsubscribe: (eventKey: ViewEvent, listener: ViewEventListener) => void;
  emit: (result: any, eventKey: ViewEvent) => void;
};

export type UseViewEventsReturns = Returns;

export default function useViewEvents(): Returns {
  const {eventListenersRef} = useContext(ViewEventListenerContext);
  const {workspaceConfig} = useContext(WorkspaceContext);
  
  const subscribe = (eventKey: ViewEvent, listener: ViewEventListener) => {
    if( !eventListenersRef ) {
      return;
    }

    let listenerMap: ViewEventListenerMap | undefined = 
      eventListenersRef.current[workspaceConfig.id];

    if( !listenerMap ) {
      listenerMap = {};
      eventListenersRef.current[workspaceConfig.id] = listenerMap;
    }

    if( listenerMap[eventKey] ) {
      listenerMap[eventKey].push(listener);
    } else {
      listenerMap[eventKey] = [listener];
    }
  };

  const unsubscribe = (eventKey: ViewEvent, listener: ViewEventListener) => {
    if( !eventListenersRef ) {
      return;
    }

    const listenerMap: ViewEventListenerMap | undefined = eventListenersRef.current[workspaceConfig.id];

    if( listenerMap && listenerMap[eventKey] ) {
      const listenerIndex: number = listenerMap[eventKey].indexOf(listener);

      if( listenerIndex >= 0 ) {
        listenerMap[eventKey] = (
          removeArrayIndex<ViewEventListener>(listenerMap[eventKey], listenerIndex)
        );
      }
    }
  };

  const emit = (result: any, eventKey: ViewEvent) => {
    if( !eventListenersRef ) {
      return;
    }

    const listenerMap: ViewEventListenerMap | undefined = eventListenersRef.current[workspaceConfig.id];

    if( listenerMap && listenerMap[eventKey] ) {
      listenerMap[eventKey]
      .forEach((listener: ViewEventListener) => listener(result, eventKey, workspaceConfig.id));
    }
  };

  return {
    subscribe,
    unsubscribe,
    emit
  };
}
