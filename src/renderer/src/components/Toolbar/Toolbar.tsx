import "./Toolbar.css";

import { ReactNode, useEffect, useState } from "react";
import ToolbarDropdown, { ToolbarOption } from "./ToolbarDropdown";
import useFileSystemDialog from "@renderer/hook/useFileSystemDialog";


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
      },
      {
        key: "close-workspace",
        label: "Close"
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
  const [openDropMenu, setOpenDropMenu] = useState<DropMenuOption | "none">("none");

  const {showOpenDirectoryDialog} = useFileSystemDialog({
    onOpenDialogResult: (result) => console.log(result)
  });

  useEffect(() => {
    const outsideClickListener = () => {
      if( openDropMenu !== "none" ) {
        setOpenDropMenu("none");
      }
    };
    document.addEventListener("mousedown", outsideClickListener);

    return () => {
      document.removeEventListener("mousedown", outsideClickListener);
    };
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
      case "close-workspace": 
        console.log("closed");
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