import "./Toolbar.css";

import { MutableRefObject, ReactNode, useContext, useEffect, useRef, useState } from "react";
import ToolbarDropdown, { ToolbarOption } from "./ToolbarDropdown";
import useFileSystemDialog from "@renderer/hook/useFileSystemDialog";
import { OpenDialogResult } from "src/shared/files.type";
import { SplitTree, SplitTreeFork, SplitTreeValue } from "@renderer/model/splits";
import { FlexibleSplitsContext } from "@renderer/context/FlexibleSplitsContext";


type DropMenuOption = "workspace" | "theme" | "shortcuts";

type MenuOption = {
  key: DropMenuOption;
  label: string;
  menu?: ToolbarOption[];
};

const MENU_OPTIONS: MenuOption[] = [
  {
    key: "workspace",
    label: "Workspace",
    menu: [
      {
        key: "new-workspace",
        label: "New"
      },
      {
        key: "open-workspace",
        label: "Open"
      }
    ]
  },
  {
    key: "theme",
    label: "Theme"
  },
  {
    key: "shortcuts",
    label: "Shortcuts"
  }
];

type AddWorkspace = (caption: string, targetNode: SplitTreeValue) => void;

type Props = {
  addWorkspace: AddWorkspace;
};

export default function Toolbar(props: Props): ReactNode {
  const pAddWorkspace: AddWorkspace = props.addWorkspace;
  const [openDropMenu, setOpenDropMenu] = useState<DropMenuOption | "none">("none");
  const {splitTree} = useContext(FlexibleSplitsContext);

    // This ref is only used so that the hooks passed onto the useFileSystemDialog may use 
    // fresh values of the split tree
  const splitTreeRef: MutableRefObject<SplitTree | null | undefined> = useRef(splitTree);
  splitTreeRef.current = splitTree;

  const dispatchDialogResult = (result: OpenDialogResult) => {
    if( result.cancelled || !splitTreeRef.current ) {
      return;
    }

    switch( result.key ) {
      case "new-workspace": 
        const path: string = result.path[0];
        pAddWorkspace(
          path.substring(path.lastIndexOf("\\") + 1, path.length), 
          (splitTreeRef.current.root.left as SplitTreeFork).left as SplitTreeValue
        );
        break;
    }
  };

  const {showOpenDirectoryDialog} = useFileSystemDialog({
    onOpenDialogResult: dispatchDialogResult
  });

  useEffect(() => {
    const outsideClickListener = () => {
      if( openDropMenu !== "none" ) {
        setOpenDropMenu("none");
      }
    };
    document.addEventListener("mousedown", outsideClickListener);

    return () => document.removeEventListener("mousedown", outsideClickListener);
  }, [openDropMenu]);

  const dispatchOption = (optionKey: string) => {
    switch( optionKey ) {
      case "new-workspace": 
        showOpenDirectoryDialog({
          key: optionKey,
          options: {
            title: "Create a new workspace"
          }
        });
        break;
      case "open-workspace": 
        showOpenDirectoryDialog({
          key: optionKey,
          options: {
            title: "Open a workspace"
          }
        });
        break;
      case "theme": console.log(optionKey); break;
      case "shortcuts": console.log(optionKey); break;
    }
  };

  const handleMainOptionSelection = (optionKey: DropMenuOption) => {
    dispatchOption(optionKey);

    if( openDropMenu === optionKey ) {
      setOpenDropMenu("none");
    } else {
      setOpenDropMenu(optionKey);
    }
  };

  const handleMainOptionHover = (optionKey: DropMenuOption) => {
    if( openDropMenu !== "none" ) {
      setOpenDropMenu(optionKey);
    }
  };

  const handleMenuOptionSelection = (optionKey: string) => {
    dispatchOption(optionKey);
    setOpenDropMenu("none");
  };


  return (
    <div
      className="d-flex"
      onMouseDown={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation()}
    >
      {MENU_OPTIONS.map((option: MenuOption) => {
        return (
          <ToolbarDropdown
            key={"toolbar-option-" + option.key}
            caption={option.label}
            options={option.menu}
            isOpen={openDropMenu === option.key}
            onOptionSelect={handleMenuOptionSelection}
            onOpen={() => {handleMainOptionSelection(option.key)}}
            onHover={() => handleMainOptionHover(option.key)}
          />
        );
      })}
    </div>
  );
}
