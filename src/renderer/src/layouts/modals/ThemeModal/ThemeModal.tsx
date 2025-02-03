import { ReactNode, useContext } from "react";
import { ModalProps, OnModalClose } from "../modal.types";
import StandardModal from "../StandardModal/StandardModal";
import useTheme from "@renderer/hook/useTheme";
import { ModalContext } from "@renderer/context/ModalContext";
import { APP_THEMES, AppTheme } from "@renderer/context/ThemeContext";
import firstLetterCapitalized from "@renderer/utils/firstLetterCapitalized";
import useTabKeys from "@renderer/hook/useTabKeys";


export default function ThemeModal(props: ModalProps): ReactNode {
  const pOnClose: OnModalClose | undefined = props.onClose;

  const {activeTheme, setTheme, theme} = useTheme();
  const {closeModal} = useContext(ModalContext);
  const {formatKey} = useTabKeys();

  const handleClose = () => {
    if( pOnClose ) {
      pOnClose();
    } else {
      closeModal();
    }
  };

  const renderThemeButtons = () => {
    return APP_THEMES.map((t: AppTheme) => {
      return (
        <div
          key={formatKey("theme-modal-theme-selection-" + t)}
          className="cursor-pointer"
        >
          <input
            type="radio"
            checked={t === activeTheme}
            onChange={() => setTheme && setTheme(t)}
          />
          <span  
            className="ml-medium-length cursor-pointer"
            onClick={() => setTheme && setTheme(t)}
          >
            {firstLetterCapitalized(t)}
          </span>
        </div>
      );
    });
  };

  return (
    <StandardModal
      title="Select theme"
      onClose={handleClose}
    >
      <div {...theme("ambient-bgc", "script-c")}>
        <fieldset>
          <legend>Available themes</legend>
          {renderThemeButtons()}
        </fieldset>
      </div>
    </StandardModal>
  );
}
