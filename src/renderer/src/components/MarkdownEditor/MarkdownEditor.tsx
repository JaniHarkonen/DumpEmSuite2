import "./MarkdownEditor.css";

import useEditable from "@renderer/hook/useEditable";
import { renderMarkdown } from "@renderer/model/markdown/markdown";
import { ChangeEvent, FocusEvent, KeyboardEvent, useEffect, useState } from "react";
import StyledTextarea from "../StyledTextarea/StyledTextarea";
import { ASSETS } from "@renderer/assets/assets";
import StyledIcon from "../StyledIcon/StyledIcon";


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

  useEffect(() => setMarkdown(pInitialValue), [pInitialValue]);

  const handleTab = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const target: HTMLTextAreaElement = e.currentTarget;

    if( e.key === "Tab" ) {
      e.preventDefault();

        // Apply tab to the textarea and fix the cursor position
      const selectionStart: number = target.selectionStart;
      target.value = 
        target.value.substring(0, selectionStart) + "\t" + 
        target.value.substring(selectionStart);
      target.selectionStart = selectionStart + 1;
      target.selectionEnd = selectionStart + 1;
    } else if( e.ctrlKey ) {
      const secondaryKey: string = e.key.toLowerCase();

      if( secondaryKey === "s" ) {
          // Save without finalizing
        e.preventDefault();
        handleSave(target.value);
      } else if( e.key === "Enter" ) {
          // Finalize and save
        handleFinalize(target.value);
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setWasEdited(e.target.value !== markdown);
  };

  return (
    <div
      className="w-100 h-100"
      onDoubleClick={handleEditStart}
    >
      {isEditing && (
        <div className="markdown-editor-textarea-container">
          {wasEdited ? (
            <div className="m-strong-length">
              <StyledIcon src={ASSETS.icons.alerts.missing.color} />
              <span className="ml-medium-length">* Unsaved changes detected! Press CTRL + S to save...</span>
            </div>
          ) : <div />}
          <StyledTextarea
            className="w-100 h-100"
            style={{
              opacity: wasEdited ? "70%" : "100%"
            }}
            onBlur={(e: FocusEvent<HTMLTextAreaElement>) => handleFinalize(e.target.value)}
            autoFocus={true}
            defaultValue={markdown}
            onKeyDown={handleTab}
            onChange={handleChange}
          />
        </div>
      )}
        <div
          className="user-select-text h-100"
          style={{display: isEditing ? "none" : "block"}}
        >
          {(markdown.trimStart().length > 0 ) ? renderMarkdown(markdown) : (
            <div className="markdown-editor-start-suggestion">
              Double-click here to start editing
            </div>
          )}
        </div>
    </div>
  );
}
