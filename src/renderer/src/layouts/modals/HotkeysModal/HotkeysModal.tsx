import "./HotkeysModal.css";

import { ReactNode } from "react";
import StandardModal from "../StandardModal/StandardModal";
import HotkeyInput from "@renderer/components/HotkeyInput/HotkeyInput";
import useTheme from "@renderer/hook/useTheme";
import StyledButton from "@renderer/components/StyledButton/StyledButton";
import useHotkeys from "@renderer/hook/useHotkeys";
import { KeyConfig } from "@renderer/model/hotkey";


export default function HotkeysModal(): ReactNode {
  const {theme} = useTheme();
  const {hotkeyConfig, configureHotkey} = useHotkeys();

  const renderHotkey = (label: string, accessor: string) => {
    if( !hotkeyConfig ) {
      return <></>;
    }

    const keyConfig: KeyConfig | undefined = hotkeyConfig[accessor];

    if( !keyConfig ) {
      return <></>;
    }

    return (
      <div className="d-flex w-100 gap-medium-length">
        <div className="w-100 user-select-text">
          <strong>{label}:</strong>
        </div>
        <div>
          {keyConfig.key && (keyConfig.key.map((key: string | null, index: number) => {
            return (
              <div
                key={"hotkeys-modal-hotkey-config-" + key + "-" + index}
                className="mb-medium-length"
              >
                <HotkeyInput
                  hotkey={key}
                  onSelect={(hotkey: string | null) => configureHotkey(accessor, hotkey, index)}
                />
              </div>
            );
          }))}
          <div className="d-flex d-justify-end mt-medium-length">
            <StyledButton onClick={() => {
              configureHotkey(accessor, null)
            }}>Alt.</StyledButton>
          </div>
        </div>
      </div>
    );
  };

  if( !hotkeyConfig ) {
    return <>Unable to load hotkey configurations!</>;
  }

  return (
    <StandardModal
      title="Hotkeys"
      className="h-50"
    >
      <div {...theme("script-c overflow-auto h-100")}>
      <fieldset className="d-flex d-direction-column gap-strong-length">
        <legend>Configure hotkeys</legend>

        <h3>Actions</h3>
        {renderHotkey("Remove/close tab", "close-remove-tab")}
        {renderHotkey("Edit tab title", "edit-tab")}
        {renderHotkey("Activate", "activate")}
        {renderHotkey("Finalize edit", "finalize")}
        {renderHotkey("Unfocus", "blur")}
        {renderHotkey("Navigate up", "navigate-up")}
        {renderHotkey("Navigate down", "navigate-down")}
        {renderHotkey("Navigate left", "navigate-left")}
        {renderHotkey("Navigate right", "navigate-right")}
        {renderHotkey("Confirm dialog", "confirm")}
        {renderHotkey("Deny dialog", "deny")}

        <h3>Companies-module</h3>
        {renderHotkey("Companies", "module-companies")}
        {renderHotkey("Companies→Scraper", "view-scraper")}
        {renderHotkey("Companies→Listings", "view-listings")}
        {renderHotkey("Companies→Profiles", "view-profiles")}
        {renderHotkey("Companies→Profiles→Companies", "view-company-list")}
        {renderHotkey("Companies→Profiles→Chart", "view-chart")}
        {renderHotkey("Companies→Profiles→Profile", "view-company-profile")}
        
        <h3>Analysis-module</h3>
        {renderHotkey("Analysis", "module-analysis")}
        {/* {renderHotkey("Analysis→STEP→Stocks")}
        {renderHotkey("Analysis→STEP→Chart")}
        
        {renderHotkey("Analysis→STEP→Notes")} */}
        {renderHotkey("Analysis→Fundamental", "view-fundamental-filtration")}
        {renderHotkey("Analysis→Fundamental→Stocks", "view-fundamental-stocks")}
        {renderHotkey("Analysis→Fundamental→Chart", "view-fundamental-chart")}
        {renderHotkey("Analysis→Fundamental→Notes", "view-fundamental-material-browser")}
        {renderHotkey("Analysis→Fundamental→Materials", "view-fundamental-profile")}
        {renderHotkey("Analysis→Fundamental→Profile", "view-fundamental-notes")}

        <h3>Macro-module</h3>
        {renderHotkey("Macro", "module-macro")}
        {/* {renderHotkey("Macro→SECTOR→Notes")}
        {renderHotkey("Macro→SECTOR→Materials")} */}
      </fieldset></div>
    </StandardModal>
  );
}
