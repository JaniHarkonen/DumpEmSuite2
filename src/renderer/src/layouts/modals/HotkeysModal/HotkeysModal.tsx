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

    const keyConfig: KeyConfig = hotkeyConfig[accessor];
    return (
      <div className="d-flex w-100 gap-medium-length">
        <div className="w-100 user-select-text">
          <strong>{label}:</strong>
        </div>
        <div>
          {keyConfig.key ? (keyConfig.key.map((key: string | null, index: number) => {
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
          })) : (
            <div>
              <HotkeyInput/>
            </div>
          )}
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
        {renderHotkey("Activate", "activate")}
        {renderHotkey("Navigate up", "navigate-up")}
        {renderHotkey("Navigate down", "navigate-down")}
        {renderHotkey("Navigate left", "navigate-left")}
        {renderHotkey("Navigate right", "navigate-right")}

        <h3>Companies-module</h3>
        {/* {renderHotkey("Companies")}
        {renderHotkey("Companies→Scraper")}
        {renderHotkey("Companies→Listings")}
        {renderHotkey("Companies→Profiles")}
        {renderHotkey("Companies→Profiles→Companies")}
        {renderHotkey("Companies→Profiles→Chart")}
        {renderHotkey("Companies→Profiles→Profile")} */}
        
        <h3>Analysis-module</h3>
        {/* {renderHotkey("Analysis")}
        {renderHotkey("Analysis→STEP→Stocks")}
        {renderHotkey("Analysis→STEP→Chart")}
        {renderHotkey("Analysis→STEP→Notes")}
        {renderHotkey("Analysis→Fundamental→Stocks")}
        {renderHotkey("Analysis→Fundamental→Chart")}
        {renderHotkey("Analysis→Fundamental→Notes")}
        {renderHotkey("Analysis→Fundamental→Materials")}
        {renderHotkey("Analysis→Fundamental→Profile")} */}

        <h3>Macro-module</h3>
        {/* {renderHotkey("Macro")}
        {renderHotkey("Macro→SECTOR→Notes")}
        {renderHotkey("Macro→SECTOR→Materials")} */}
      </fieldset></div>
    </StandardModal>
  );
}
