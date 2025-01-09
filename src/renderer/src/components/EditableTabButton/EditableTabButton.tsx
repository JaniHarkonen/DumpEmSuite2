import "../Tabs/TabControls/TabButton/TabButton.css";

import { Tab } from "@renderer/model/tabs";
import { MouseEvent, ReactNode } from "react";
import { ASSETS } from "@renderer/assets/assets";
import TabButton, { OnCaptionEditFinalize } from "../Tabs/TabControls/TabButton/TabButton";


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
  const pIconURL: string = props.iconURL || ASSETS.icons.buttons.trashCan.white;


  return (
    <TabButton
      tab={pTab}
      isEditable={pAllowEdit}
      onCaptionEdit={pOnCaptionEdit}
    >
      {pAllowRemove && (
        <span
          className="tab-remove-icon-container"
          onClick={pOnRemove}
        >
          <img
            className="size-tiny-icon tab-remove-icon"
            src={pIconURL}
          />
        </span>
      )}
    </TabButton>
  );
}
