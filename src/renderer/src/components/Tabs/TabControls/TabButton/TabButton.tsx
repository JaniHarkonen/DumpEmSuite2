import "./TabButton.css";

import { indexOfTab, Tab } from "@renderer/model/tabs";
import { FocusEvent, KeyboardEvent, PropsWithChildren, ReactNode, useContext, useState } from "react";
import { TabsContext } from "@renderer/context/TabsContext";
import useEditable, { OnEditFinalize } from "@renderer/hook/useEditable";


export type OnCaptionEditFinalize = OnEditFinalize<string>;

type Props = {
  tab: Tab;
  isEditable?: boolean;
  onCaptionEdit?: OnEditFinalize<string>;
} & PropsWithChildren;

export default function TabButton(props: Props): ReactNode {
  const pTab: Tab = props.tab;
  const pIsEditable: boolean = props.isEditable ?? false;
  const pOnCaptionEdit: OnCaptionEditFinalize = props.onCaptionEdit || function(){ };
  const pChildren: ReactNode[] | ReactNode = props.children;

  const {tabs, onSelect, onOpen, onDrop} = useContext(TabsContext);
  const [isEditing, handleEditStart, handleFinalize, handleEnter] = useEditable<string>({
    onFinalize: (value: string) => {
      setCaption(value); 
      pOnCaptionEdit(value);
    }
  });
  const [caption, setCaption] = useState<string>(pTab.caption);

  const handleTabDrop = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const index: number = indexOfTab(tabs, pTab);
    e.stopPropagation();
    onDrop && onDrop(index);
  };

  return (
    <button
      className="tab-controls-button"
      onMouseDown={() => onSelect && onSelect(pTab)}
      onClick={() => onOpen && onOpen(pTab)}
      onMouseUp={handleTabDrop}
      onDoubleClick={() => pIsEditable && handleEditStart()}
    >
      <span>
        {isEditing ? (
          <input
            defaultValue={caption}
            onBlur={(e: FocusEvent<HTMLInputElement, Element>) => {
              handleFinalize(e.currentTarget.value);
            }}
            autoFocus={true}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              handleEnter(e.code, e.currentTarget.value);
            }}
          />
        ) : (
          caption
        )}
      </span>
      {pChildren}
    </button>
  );
}
