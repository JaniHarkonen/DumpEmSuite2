import "./MarkdownEditor.css";

import useEditable from "@renderer/hook/useEditable";
import { renderMarkdown } from "@renderer/model/markdown/markdown";
import { ChangeEvent, FocusEvent, KeyboardEvent, useEffect, useState } from "react";
import StyledTextarea from "../StyledTextarea/StyledTextarea";
import { ASSETS } from "@renderer/assets/assets";
import StyledIcon from "../StyledIcon/StyledIcon";
import useTabKeys from "@renderer/hook/useTabKeys";
import { MarkdownContext } from "@renderer/context/MarkdownContext";
import StyledButton from "../StyledButton/StyledButton";
import useTheme from "@renderer/hook/useTheme";
import useHotkeys from "@renderer/hook/useHotkeys";


type OnSaveNoteChanges = (value: string) => void;

type Props = {
  initialValue?: string;
  onSaveChange?: OnSaveNoteChanges;
};

export default function MarkdownEditor(props: Props) {
  const pInitialValue: string = props.initialValue || "";
  const pOnSaveChanges: OnSaveNoteChanges = props.onSaveChange || function(){ };

  const [markdown, setMarkdown] = useState<string>("");
  const [wasEdited, setWasEdited] = useState<boolean>(false);

  const {theme} = useTheme();
  const {hotkey} = useHotkeys();
  
  const handleSave = (value: string) => {
    pOnSaveChanges(value);
    setMarkdown(value);
    setWasEdited(false);
  };

  const [
    isEditing,
    handleEditStart,
    handleFinalize
  ] = useEditable<string>({
    onFinalize: handleSave
  });

  const {formatKey} = useTabKeys();

  useEffect(() => setMarkdown(pInitialValue), [pInitialValue]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setWasEdited(e.target.value !== markdown);
  };

  return (
    <MarkdownContext.Provider value={{
      markdown,
      onComponentChange: handleSave
    }}>
      <div className="w-100 h-100">
        {isEditing && (
          <div className="markdown-editor-textarea-container">
            {wasEdited ? (
              <div className="m-strong-length">
                <StyledIcon
                  src={ASSETS.icons.alerts.missing.color}
                  enableFilter={false}
                />
                <span className="ml-medium-length">* Unsaved changes detected! Press CTRL + S to save...</span>
              </div>
            ) : <div />}
            <StyledTextarea
              className="w-100 h-100"
              style={{
                opacity: wasEdited ? "70%" : "100%",
                tabSize: "2"
              }}
              onBlur={(e: FocusEvent<HTMLTextAreaElement>) => handleFinalize(e.target.value)}
              autoFocus={true}
              defaultValue={markdown}
              {...hotkey({
                "blur": (e: KeyboardEvent<HTMLTextAreaElement>) => e.currentTarget.blur(),
                "save": (e: KeyboardEvent<HTMLTextAreaElement>) => {
                  e.preventDefault();
                  handleSave(e.currentTarget.value);
                }
              })}
              onChange={handleChange}
            />
          </div>
        )}
        <div
          className="markdown-editor-renderer-container"
          style={{display: isEditing ? "none" : "grid"}}
        >
          <div className="d-flex d-justify-end">
            <StyledButton
              icon={ASSETS.icons.action.edit.black}
              onClick={handleEditStart}
            >
              Edit
            </StyledButton>
          </div>
          <div>
            {(markdown.trimStart().length > 0 ) ? renderMarkdown(markdown, formatKey("")) : (
              <div {...theme("script-c", "markdown-editor-start-suggestion")}>
                Click "Edit" to start taking notes.
              </div>
            )}
          </div>
        </div>
      </div>
    </MarkdownContext.Provider>
  );
}
