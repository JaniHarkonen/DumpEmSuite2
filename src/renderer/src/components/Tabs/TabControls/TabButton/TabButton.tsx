import "./TabButton.css";

import { indexOfTab, Tab } from "@renderer/model/tabs";
import { FocusEvent, KeyboardEvent, MutableRefObject, PropsWithChildren, ReactNode, useContext, useRef, useState } from "react";
import { TabsContext } from "@renderer/context/TabsContext";
import useEditable, { OnEditFinalize } from "@renderer/hook/useEditable";
import useTheme from "@renderer/hook/useTheme";
import StyledInput from "@renderer/components/StyledInput/StyledInput";
import { HotkeyListenerReturns, mergeListeners } from "@renderer/hotkey/hotkeyListener";
import useHotkeys from "@renderer/hook/useHotkeys";
import useDocumentHotkeys from "@renderer/hook/useDocumentHotkeys";
import { GlobalContext } from "@renderer/context/GlobalContext";


export type OnCaptionEditFinalize = OnEditFinalize<string>;

type Props = {
  tab: Tab;
  isEditable?: boolean;
  onCaptionEdit?: OnEditFinalize<string>;
  hotkeyListener?: HotkeyListenerReturns<HTMLButtonElement>;
} & PropsWithChildren;

export default function TabButton(props: Props): ReactNode {
  const pTab: Tab = props.tab;
  const pIsEditable: boolean = props.isEditable ?? false;
  const pOnCaptionEdit: OnCaptionEditFinalize = props.onCaptionEdit || function(){ };
  const pHotkeyListener: HotkeyListenerReturns<HTMLButtonElement> | undefined = 
    props.hotkeyListener;
  const pChildren: ReactNode[] | ReactNode = props.children;

  const {tabs, activeTabIndex, onSelect, onOpen, onDrop, tabIndex} = useContext(TabsContext);
  const {config} = useContext(GlobalContext);

  const {theme} = useTheme();
  const {hotkey} = useHotkeys();

  const [caption, setCaption] = useState<string>(pTab.caption);
  const [isEditing, handleEditStart, handleFinalize, handleEnter] = useEditable<string>({
    onFinalize: (value: string) => {
      setCaption(value); 
      pOnCaptionEdit(value);
    }
  });

  const tabButtonRef: MutableRefObject<HTMLButtonElement | null> = useRef<HTMLButtonElement | null>(null);

  useDocumentHotkeys({ actionMap: {
    [pTab.id]: () => {
      if( config.activeWorkspaceIDRef?.current === pTab.workspace ) {
        tabButtonRef.current?.click();
        tabButtonRef.current?.focus();
      }
    }
  }});

  const isTabActive: boolean = pTab.id === (tabs[activeTabIndex]?.id);
  const variableStyle: string = 
    isTabActive ? "shadow-bgc highlight glyph-bdc-bottom" : "ambient-bgc";

  const handleTabDrop = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const index: number = indexOfTab(tabs, pTab);
    e.stopPropagation();
    onDrop && onDrop(index);
  };

  return (
    <button
      {...theme("glyph-c", variableStyle, "outline-bdc", "highlight-hl", "tab-controls-button")}
      onMouseDown={() => onSelect && onSelect(pTab)}
      onClick={() => !isEditing && onOpen && onOpen(pTab)}
      onMouseUp={handleTabDrop}
      onDoubleClick={() => pIsEditable && handleEditStart()}
      {...mergeListeners(pHotkeyListener, hotkey({
        "edit-tab": (e: React.KeyboardEvent<HTMLElement>) => {
          if( pIsEditable ) {
            e.stopPropagation();
            e.preventDefault();
            handleEditStart();
          }
        }
      }))}
      ref={tabButtonRef}
      tabIndex={Math.max(0, tabIndex() - 1)}
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
              e.stopPropagation();
              handleEnter(e.code, e.currentTarget.value);
            }}
          />
        ) : (caption)}
      </span>
      {pChildren}
    </button>
  );
}
