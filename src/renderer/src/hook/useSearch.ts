import { TabsContext } from "@renderer/context/TabsContext";
import { Tab } from "@renderer/model/tabs";
import { useContext, useEffect, useState } from "react";


export type SearchCriteria = {
  [key in string]: string;
}

type Returns = {
  searchCriteria: SearchCriteria;
  handleCriteriaChange: (criteria: string, value: string) => void;
  search: (items: any[]) => any[];
};

export default function useSearch(): Returns {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({});
  const {tabs, activeTabIndex, setExtraInfo} = useContext(TabsContext);
  const activeTab: Tab | undefined = tabs[activeTabIndex];
  const extraInfo: any | undefined = activeTab?.extra;

  useEffect(() => {
    setSearchCriteria(extraInfo?.searchCriteria || {});
  }, [extraInfo?.searchCriteria]);

  const handleCriteriaChange = (criteria: string, value: string) => {
    setSearchCriteria((prev: SearchCriteria) => {
      return {
        ...prev,
        [criteria]: value
      };
    });
    
    setExtraInfo && setExtraInfo({
      searchCriteria: {
        ...searchCriteria,
        [criteria]: value
      }
    });
  };

  const search = (items: any[]) => {
    for( let key of Object.keys(searchCriteria) ) {
      const searchCriteriaLower = searchCriteria[key].toLowerCase();

      if( searchCriteriaLower !== "" ) {
        items = items.filter((item: any) => {
          return (item.data[key] + "").toLowerCase().startsWith(searchCriteriaLower);
        }); 
      }
    }

    return items;
  };

  return {
    searchCriteria,
    handleCriteriaChange,
    search
  };
}
