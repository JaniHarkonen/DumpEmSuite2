import "./TabButton.css";

import { indexOfTab, Tab } from "@renderer/model/tabs";
import { FocusEvent, KeyboardEvent, PropsWithChildren, ReactNode, useContext, useState } from "react";
import { TabsContext } from "@renderer/context/TabsContext";
import useEditable, { OnEditFinalize } from "@renderer/hook/useEditable";
import useTheme from "@renderer/hook/useTheme";
import StyledInput from "@renderer/components/StyledInput/StyledInput";
import { OnKeyDown } from "@renderer/utils/applyKeyListener";


export type OnCaptionEditFinalize = OnEditFinalize<string>;

type Props = {
  tab: Tab;
  isEditable?: boolean;
  onCaptionEdit?: OnEditFinalize<string>;
  hotkeyListener?: OnKeyDown;
} & PropsWithChildren;

export default function TabButton(props: Props): ReactNode {
  const pTab: Tab = props.tab;
  const pIsEditable: boolean = props.isEditable ?? false;
  const pOnCaptionEdit: OnCaptionEditFinalize = props.onCaptionEdit || function(){};
  const pHotkeyListener: OnKeyDown = props.hotkeyListener || function(){ };
  const pChildren: ReactNode[] | ReactNode = props.children;

  const {tabs, activeTabIndex, onSelect, onOpen, onDrop} = useContext(TabsContext);
  const {theme} = useTheme();

  const isTabActive: boolean = pTab.id === (tabs[activeTabIndex]?.id);
  const variableStyle: string = 
    isTabActive ? "shadow-bgc highlight glyph-bdc-bottom" : "ambient-bgc";

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
      {...theme("glyph-c", variableStyle, "outline-bdc", "highlight-hl", "tab-controls-button")}
      onMouseDown={() => onSelect && onSelect(pTab)}
      onClick={() => onOpen && onOpen(pTab)}
      onMouseUp={handleTabDrop}
      onDoubleClick={() => pIsEditable && handleEditStart()}
      onKeyDown={pHotkeyListener}
    >
      <span>
        {isEditing ? (
          <StyledInput
            type="text"
            defaultValue={caption}
            onBlur={(e: FocusEvent<HTMLInputElement, Element>) => {
              handleFinalize(e.currentTarget.value);
            }}
            autoFocus={true}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              handleEnter(e.code, e.currentTarget.value);
            }}
          />
        ) : (caption)}
      </span>
      {pChildren}
    </button>
  );
}
