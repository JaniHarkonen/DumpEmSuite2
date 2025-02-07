import "./Toolbar.css";
import useTheme from "@renderer/hook/useTheme";
import { ReactNode } from "react";
import useTabKeys from "@renderer/hook/useTabKeys";
import { MenuOption } from "./Toolbar";


export type ToolbarOption = {
  key: string;
  label: string;
};

type OnOptionSelect = (optionKey: string) => void;

type Props = {
  option: MenuOption;
  caption: string;
  isOpen: boolean;
  options?: ToolbarOption[];
  onOptionSelect?: OnOptionSelect;
  onOpen?: () => void;
  onHover?: () => void;
};

export default function ToolbarDropdown(props: Props): ReactNode {
  const pOption: MenuOption = props.option;
  const pCaption: string = props.caption;
  const pIsOpen: boolean = props.isOpen;
  const pOptions: ToolbarOption[] = props.options ?? [];
  const pOnOptionSelect: OnOptionSelect = props.onOptionSelect || function(){ };
  const pOnOpen: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void = 
    props.onOpen || function(){ };
  const pOnHover: () => void = props.onHover || function(){ };

  const {theme} = useTheme();
  const {formatKey} = useTabKeys();

  return (
    <div>
      <button
        {...theme("shadow-bgc", "glyph-c", "highlight-hl")}
        id={pOption.key}
        onClick={(e) => pOnOpen(e)}
        onMouseEnter={pOnHover}
      >
        {pCaption}
      </button>
      {pIsOpen && pOptions.length > 0 && (
        <div {...theme("ambient-bgc", "outline-bdc", "dropdown-menu-container")}>
          {pOptions.map((option: ToolbarOption) => {
            return (
              <button
                {...theme("ambient-bgc", "glyph-c", "highlight-hl")}
                id={option.key}
                key={formatKey("toolbar-dropdown-option-" + option.key)}
                onClick={() => pOnOptionSelect(option.key)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
