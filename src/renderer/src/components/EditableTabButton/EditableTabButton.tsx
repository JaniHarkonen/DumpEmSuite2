import "../Tabs/TabControls/TabButton/TabButton.css";

import { Tab } from "@renderer/model/tabs";
import { MouseEvent, MutableRefObject, ReactNode, useRef } from "react";
import { ASSETS } from "@renderer/assets/assets";
import TabButton, { OnCaptionEditFinalize } from "../Tabs/TabControls/TabButton/TabButton";
import StyledIcon from "../StyledIcon/StyledIcon";
import useTheme from "@renderer/hook/useTheme";
import applyKeyListener, { OnKeyDown } from "@renderer/utils/applyKeyListener";


type OnTabRemove = (e: MouseEvent<HTMLImageElement>) => void;

type Props = {
  tab: Tab;
  allowEdit?: boolean;
  allowRemove?: boolean;
  iconURL?: string;
  onCaptionEdit?: OnCaptionEditFinalize;
  onRemove?: OnTabRemove;
};

export default function EditableTabButton(props: Props): ReactNode {
  const pTab: Tab = props.tab;
  const pAllowEdit: boolean = props.allowEdit ?? true;
  const pAllowRemove: boolean = props.allowRemove ?? true;
  const pOnCaptionEdit: OnCaptionEditFinalize = props.onCaptionEdit || function() {};
  const pOnRemove: OnTabRemove = props.onRemove || function() {};
  const pIconURL: string = props.iconURL || ASSETS.icons.action.trashCan.black;

  const {theme} = useTheme();
  const captionRef: MutableRefObject<HTMLSpanElement | null> = useRef<HTMLSpanElement | null>(null);

    // Generates the hotkey listener by calling applyKeyListener and extracting its onKeyDown-event
  const hotkeyListener: OnKeyDown = applyKeyListener({
    "Delete": (e: React.KeyboardEvent<HTMLElement>) => {
      e.stopPropagation();
      e.preventDefault();
      captionRef.current && captionRef.current.click()
    }
  }).onKeyDown;

  return (
    <TabButton
      tab={pTab}
      isEditable={pAllowEdit}
      onCaptionEdit={pOnCaptionEdit}
      hotkeyListener={hotkeyListener}
    >
      {pAllowRemove && (
        <span
          {...theme("outline-hl", "tab-remove-icon-container")}
          onClick={pOnRemove}
          ref={captionRef}
        >
          <StyledIcon
            className="size-tiny-icon tab-remove-icon"
            src={pIconURL}
          />
        </span>
      )}
    </TabButton>
  );
}
