import { Tab } from "@renderer/model/tabs";
import { Dispatch, SetStateAction, useState } from "react";

type Props = {
  activeTab: Tab | null;
};

type Returns = {
  activeTab: Tab | null;
  setActiveTab: Dispatch<SetStateAction<Tab | null>>;
};

export default function useTabs(props: Props): Returns {
  const pActiveTab: Tab | null = props.activeTab;
  const [activeTab, setActiveTab] = useState<Tab | null>(pActiveTab);
  return {
    activeTab,
    setActiveTab
  };
}
