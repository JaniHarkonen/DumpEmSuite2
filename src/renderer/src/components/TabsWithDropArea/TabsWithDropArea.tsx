import "../../layouts/ModuleView/ModuleView.css";
import "../DropArea/DropArea.css";

import { TabsProps } from "../Tabs/Tabs";
import { PropsWithChildren, ReactNode } from "react";
import DropArea, { DropAreaSettings } from "../DropArea/DropArea";
import useDropAreas from "@renderer/hook/useDropAreas";
import reactNodeToArray from "@renderer/utils/reactNodeToArray";
import useTheme from "@renderer/hook/useTheme";


type OnContentDrop = (dropArea: DropAreaSettings) => void;

type Props = {
  dropAreas: DropAreaSettings[];
  isDropActive: boolean;
  onContentDrop?: OnContentDrop;
} & TabsProps & PropsWithChildren;

export default function TabsWithDropArea(props: Props): ReactNode {
  const pControls: ReactNode[] | ReactNode = props.controls;
  const pChildren: ReactNode[] = reactNodeToArray(props.children) || [];
  const pDropAreas: DropAreaSettings[] = props.dropAreas;
  const pIsDropActive: boolean = props.isDropActive;
  const pOnContentDrop: OnContentDrop = props.onContentDrop || function() {};

  const {
    handleDropAreaHighlight, 
    handleContentDrop, 
    setActiveDropArea, 
    activeDropArea
  } = useDropAreas({ dropAreas: pDropAreas, onDrop: pOnContentDrop });

  const {theme} = useTheme();
  
  return (
    <div {...theme("shadow-bgc", "tabs-container")}>
      <div {...theme("ambient-bgc", "outline-bdc-bottom", "tab-controls-container")}>
        {pControls}
      </div>
      <div
        className="p-relative w-100 h-100 overflow-hidden"
        onMouseMove={handleDropAreaHighlight}
        onMouseUp={handleContentDrop}
        onMouseLeave={() => setActiveDropArea(null)}
      >
        {pChildren}
        <div className="drop-area">
          {pIsDropActive && activeDropArea && (
            <DropArea highlight={activeDropArea.highlight} />
          )}
        </div>
      </div>
    </div>
  );
}
