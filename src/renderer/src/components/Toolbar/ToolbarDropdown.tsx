import "./Toolbar.css";
import useTheme from "@renderer/hook/useTheme";
import { ReactNode } from "react";


export type ToolbarOption = {
  key: string;
  label: string;
};

type OnOptionSelect = (optionKey: string) => void;

type Props = {
  caption: string;
  isOpen: boolean;
  options?: ToolbarOption[];
  onOptionSelect?: OnOptionSelect;
  onOpen?: () => void;
  onHover?: () => void;
};

export default function ToolbarDropdown(props: Props): ReactNode {
  const pCaption: string = props.caption;
  const pIsOpen: boolean = props.isOpen;
  const pOptions: ToolbarOption[] = props.options ?? [];
  const pOnOptionSelect: OnOptionSelect = props.onOptionSelect || function() {};
  const pOnOpen: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void = 
    props.onOpen || function() {};
  const pOnHover: () => void = props.onHover || function() {};

  const {theme} = useTheme();

  return (
    <div>
      <button
        {...theme("shadow-bgc", "glyph-c", "outline-hl")}
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
                {...theme("ambient-bgc", "glyph-c", "outline-hl")}
                key={"toolbar-dropdown-option-" + option.key}
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
