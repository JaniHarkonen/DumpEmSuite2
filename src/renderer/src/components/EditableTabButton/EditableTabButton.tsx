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
  onCaptionEdit?: OnCaptionEditFinalize;
  onRemove?: OnTabRemove;
};

export default function EditableTabButton(props: Props): ReactNode {
  const pTab: Tab = props.tab;
  const pAllowEdit: boolean = props.allowEdit ?? true;
  const pAllowRemove: boolean = props.allowRemove ?? true;
  const pOnCaptionEdit: OnCaptionEditFinalize = props.onCaptionEdit || function() { }
  const pOnRemove: OnTabRemove = props.onRemove || function() { }


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
            src={ASSETS.icons.buttons.trashCan.white}
          />
        </span>
      )}
    </TabButton>
  );
}

// const renderTabControls = (targetNode: SplitTreeValue): ReactNode => {

//     return (
//       <TabControls>
//         {tabs.map((tab: Tab, tabIndex: number) => {
//           return (
//             <TabButton
//               key={tab.workspace + "-tab-control-button-" + tab.id}
//               tab={tab}
//               isEditable={true}
//               onCaptionEdit={(value: string) => {
//                 handleTabCaptionChange(targetNode, tabs[tabIndex], value);
//               }}
//             >
//               <span
//                 className="tab-remove-icon-container"
//                 onClick={(e: MouseEvent<HTMLImageElement>) => {
//                   handleTabRemove(e, targetNode, tabs[tabIndex]);
//                 }}
//               >
//                 <img
//                   className="size-tiny-icon tab-remove-icon"
//                   src={ASSETS.icons.buttons.trashCan.white}
//                 />
//               </span>
//             </TabButton>
//           );
//         })}
//         <button onClick={() => handleTabAdd(targetNode)}>
//           {"+"}
//         </button>
//       </TabControls>
//     );
//   };

// const renderTabControls = (targetNode: SplitTreeValue): ReactNode => {
//     const tabs: Tab[] = targetNode.value.tabs;

//     return (
//       <TabControls>
//         {tabs.map((tab: Tab, tabIndex: number) => {
//           const isFundamental: boolean = !tab.tags.includes(TAGS.permanent);

//           return (
//             <TabButton
//               key={tab.workspace + "-tab-control-button-" + tab.id}
//               tab={tab}
//               isEditable={isFundamental}
//               onCaptionEdit={(value: string) => {
//                 handleTabCaptionChange(targetNode, tabs[tabIndex], value);
//               }}
//             >
//               {isFundamental && (
//                 <span
//                   className="tab-remove-icon-container"
//                   onClick={(e: MouseEvent<HTMLImageElement>) => {
//                     handleTabRemove(e, targetNode, tabs[tabIndex]);
//                   }}
//                 >
//                   <img
//                     className="size-tiny-icon tab-remove-icon"
//                     src={ASSETS.icons.buttons.trashCan.white}
//                   />
//                 </span>
//               )}
//             </TabButton>
//           );
//         })}
//         <button onClick={() => handleTabAdd(targetNode)}>
//           {"+"}
//         </button>
//       </TabControls>
//     );
//   };