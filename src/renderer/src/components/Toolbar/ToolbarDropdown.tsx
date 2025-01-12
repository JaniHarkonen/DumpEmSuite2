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
  const pOnOpen: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void = props.onOpen || function() {};
  const pOnHover: () => void = props.onHover || function() {};

  return (
    <div>
      <button
        onClick={(e) => pOnOpen(e)}
        onMouseEnter={pOnHover}
      >
        {pCaption}
      </button>
      {pIsOpen && (
        <div className="dropdown-menu-container">
          {pOptions.map((option: ToolbarOption) => {
            return (
              <button
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
