import { TabInfoContext } from "@renderer/context/TabInfoContext";
import { useContext } from "react";

export default function FilterationView() {
  const {currentTab} = useContext(TabInfoContext);


  return (
    <>{currentTab?.id}</>
  );
}
