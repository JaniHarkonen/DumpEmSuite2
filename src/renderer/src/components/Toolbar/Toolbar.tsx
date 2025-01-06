import "./Toolbar.css";

import { ReactNode, useContext, useEffect, useState } from "react";
import ToolbarDropdown, { ToolbarOption } from "./ToolbarDropdown";
import { ModalContext } from "@renderer/context/ModalContext";
import NewWorkspaceModal from "@renderer/modals/NewWorkspaceModal/NewWorkspaceModal";


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

export default function Toolbar(): ReactNode {
  const {openModal} = useContext(ModalContext);
  const [openDropMenu, setOpenDropMenu] = useState<DropMenuOption | "none">("none");

  useEffect(() => {
    const outsideClickListener = () => {
      if( openDropMenu !== "none" ) {
        setOpenDropMenu("none");
      }
    };

    document.addEventListener("mousedown", outsideClickListener);
    return () => document.removeEventListener("mousedown", outsideClickListener);
  }, [openDropMenu]);

  const createNewWorkspace = () => {

  };

  const dispatchOption = (optionKey: string) => {
    switch( optionKey ) {
      case "new-workspace": console.log("new"); break;
      case "open-workspace": console.log("open"); break;
      case "theme": openModal(<NewWorkspaceModal />); break;
      case "shortcuts": console.log("shortcuts"); break;
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
