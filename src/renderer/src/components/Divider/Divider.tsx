import { ContentDirection, DividerSettings } from "@renderer/model/splits";
import "./Divider.css";

import reactNodeToArray from "@renderer/utils/reactNodeToArray";
import { MutableRefObject, ReactNode, useRef } from "react";
import useDraggable from "@renderer/hook/useDraggable";
import generateRandomUniqueID from "@renderer/utils/generateRandomUniqueID";
import clamp from "@renderer/utils/clamp";

type OnDividerMove = (newValue: number) => void;

type Props = {
  dividerSettings: DividerSettings;
  onDividerMove?: OnDividerMove;
  children?: ReactNode[] | ReactNode;
};

export default function Divider(props: Props): ReactNode {
  const pDividerSettings: DividerSettings = props.dividerSettings;
  const pOnDividerMove: OnDividerMove = props.onDividerMove || function() {};
  const pChildren: ReactNode[] = reactNodeToArray(props?.children) || [<></>];
  const {direction, value} = pDividerSettings;

  const mainContent: ReactNode = pChildren[0];
  const alternativeContent: ReactNode = pChildren[1];

  const idContainer: MutableRefObject<string> = 
    useRef(generateRandomUniqueID("divider-container-"));

  const {handleDragStart} = useDraggable({ 
    onDrag: (e: MouseEvent) => {
      const container: HTMLDivElement | null = 
        document.getElementById(idContainer.current) as HTMLDivElement;
      if( !container ) {
        return;
      }

      const {x, y, width, height} = container.getBoundingClientRect();
      const snapSize: number = window.innerWidth / 16;
      const mouseSnapX: number = Math.floor(e.clientX / snapSize) * snapSize;
      const mouseSnapY: number = Math.floor(e.clientY / snapSize) * snapSize;

      if( direction === "horizontal" ) {
        pOnDividerMove(clamp(10, (mouseSnapX - x) / width * 100, 90));
      } else {
        pOnDividerMove(clamp(10, (mouseSnapY - y) / height * 100, 90));
      }
    }
  }, [direction]);

  /**
   * Returns either the given value as a CSS percentage, if the content direction of the
   * divider is set to a given value. Otherwise, returns "100%".
   * 
   * @param dir Expected content direction.
   * @param val Value to be returned as a CSS percentage, if the divider content direction
   * matches the expected direction.
   * 
   * @returns Given value as a CSS percentage string or "100%".
   */
  const valueOrFill = (dir: ContentDirection, val: number): string => {
    return (alternativeContent && direction === dir ? val : 100) + "%";
  };

  return (
    <div 
      className="divider-container"
      id={idContainer.current}
    >
      <div
        className="p-absolute debug-bg-green"
        style={{
          width: valueOrFill("horizontal", value),
          height: valueOrFill("vertical", value),
        }}
      >
        {mainContent}
        {alternativeContent && (
          <div 
            className={`divider-handle debug-bg-red ${pDividerSettings.direction}`}
            onMouseDown={handleDragStart}
          />
        )}
      </div>
      {alternativeContent && (
        <div 
          className="p-absolute"
          style={{
            right: "0px",
            bottom: "0px",
            width: valueOrFill("horizontal", 100 - value),
            height: valueOrFill("vertical", 100 - value),
          }}
        >
          {alternativeContent}
        </div>
      )}
    </div>
  );
}
