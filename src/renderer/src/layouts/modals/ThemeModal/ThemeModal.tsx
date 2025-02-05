import "./ThemeModal.css";

import { ReactNode } from "react";
import { ModalProps, OnModalClose } from "../modal.types";
import StandardModal from "../StandardModal/StandardModal";
import useTheme from "@renderer/hook/useTheme";
import { APP_THEMES, AppTheme } from "@renderer/context/ThemeContext";
import firstLetterCapitalized from "@renderer/utils/firstLetterCapitalized";
import useTabKeys from "@renderer/hook/useTabKeys";


export default function ThemeModal(props: ModalProps): ReactNode {
  const pOnClose: OnModalClose | undefined = props.onClose;

  const {activeTheme, setTheme, theme} = useTheme();
  const {formatKey} = useTabKeys();

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
      className="theme-modal"
      title="Select theme"
      onClose={pOnClose}
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
