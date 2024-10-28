import "./Divider.css";

import { DividerDirection, ContentDirection } from "@renderer/model/view";
import reactNodeToArray from "@renderer/utils/reactNodeToArray";
import { ReactNode } from "react";

type DividerDirections = {
  [key in ContentDirection]: DividerDirection;
};

export const DIRECTIONS: DividerDirections = {
  horizontal: {
    flexDirection: "row", 
    resize: "horizontal"
  },
  vertical: {
    flexDirection: "column",
    resize: "vertical"
  }
};

type DividerProps = {
  direction: ContentDirection;
  children?: ReactNode[] | ReactNode;
};

export default function Divider(props: DividerProps): ReactNode {
  const pDirection: DividerDirection = DIRECTIONS[props.direction];
  const pChildren: ReactNode[] = reactNodeToArray(props?.children) || [<></>];
  const mainContent: ReactNode = pChildren[0];
  const alternateContent: ReactNode = pChildren[1];

  return (
    <div 
      className="divider-container" 
      style={{ 
        flexDirection: pDirection.flexDirection 
      }}
    >
      <div 
        className="adjustable-div debug-bg-green w-100" 
        style={{ 
          resize: alternateContent ? pDirection.resize : "none" 
        }}
      >
        {mainContent || <></>}
      </div>
      {alternateContent && (
        <div className="divider-content debug-bg-blue w-100">
          {alternateContent || <></>}
        </div>
      )}
    </div>
  );
}
