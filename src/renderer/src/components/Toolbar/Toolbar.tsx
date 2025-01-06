import "./Toolbar.css";

import { ReactNode, useEffect, useState } from "react";
import ToolbarDropdown, { ToolbarOption } from "./ToolbarDropdown";


type DropMenuOption = "workspace" | "theme";

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
  }
];

export default function Toolbar(): ReactNode {
  const [openDropMenu, setOpenDropMenu] = useState<DropMenuOption | "none">("none");

  useEffect(() => {
    const outsideClickListener = () => {
      if( openDropMenu !== "none" ) {
        setOpenDropMenu("none");
      }1
    };

    document.addEventListener("mousedown", outsideClickListener);
    return () => document.removeEventListener("mousedown", outsideClickListener);
  }, [openDropMenu]);

  const dispatchOption = (optionKey: string) => {
    switch( optionKey ) {
      case "new-workspace": console.log("new"); break;
      case "open-workspace": console.log("open"); break;
      case "theme": console.log("theme"); break;
    }
  };

  const handleMainOptionSelection = (optionKey: DropMenuOption) => {
    if( openDropMenu === optionKey ) {
      dispatchOption(optionKey);
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
