import "./MarkdownEditor.css";

import useEditable from "@renderer/hook/useEditable";
import { renderMarkdown } from "@renderer/model/markdown/markdown";
import { ChangeEvent, KeyboardEvent, MutableRefObject, useEffect, useRef, useState } from "react";
import StyledTextarea from "../StyledTextarea/StyledTextarea";
import { ASSETS } from "@renderer/assets/assets";
import StyledIcon from "../StyledIcon/StyledIcon";
import useTabKeys from "@renderer/hook/useTabKeys";
import { MarkdownContext } from "@renderer/context/MarkdownContext";
import StyledButton from "../StyledButton/StyledButton";
import useTheme from "@renderer/hook/useTheme";
import useHotkeys from "@renderer/hook/useHotkeys";
import useSavedScrollBar from "@renderer/hook/useSavedScrollBar";


type OnSaveNoteChanges = (value: string) => void;

type Props = {
  initialValue?: string;
  onSaveChange?: OnSaveNoteChanges;
  allowEdit?: boolean;
  editorID?: string;
};

export default function MarkdownEditor(props: Props) {
  const pInitialValue: string = props.initialValue || "";
  const pOnSaveChanges: OnSaveNoteChanges = props.onSaveChange || function(){ };
  const pAllowEdit: boolean = props.allowEdit ?? true;
  const pEditorID: string = props.editorID || "markdown-editor";

  const [markdown, setMarkdown] = useState<string>("");
  const [wasEdited, setWasEdited] = useState<boolean>(false);

  const {theme} = useTheme();
  const {hotkey, hotkeyConfig} = useHotkeys();

  const editorRef: MutableRefObject<HTMLTextAreaElement | null> = useRef<HTMLTextAreaElement | null>(null);

  const [handleScroll] = useSavedScrollBar({
    scrollBarID: pEditorID,
    scrolledElementRef: editorRef
  });
  
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
            <div className="m-strong-length">
              {wasEdited && (<StyledIcon
                src={ASSETS.icons.alerts.missing.color}
                enableFilter={false}
              />)}
              <span className="ml-medium-length">
                {
                  wasEdited ? <>* Unsaved changes detected! Press CTRL + S to save..."</> : 
                  <>Press {hotkeyConfig!["blur"].key ?? ""} to stop editing.</>
                }
              </span>
            </div>
            <StyledTextarea
              className="w-100 h-100"
              style={{
                opacity: wasEdited ? "70%" : "100%",
                tabSize: "2"
              }}
              autoFocus={true}
              defaultValue={markdown}
              {...hotkey({
                "blur": (e: KeyboardEvent<HTMLTextAreaElement>) => handleFinalize((e.target as HTMLTextAreaElement).value),
                "save": (e: KeyboardEvent<HTMLTextAreaElement>) => {
                  e.preventDefault();
                  handleSave(e.currentTarget.value);
                }
              })}
              onChange={handleChange}
              reactRef={editorRef}
              onScroll={handleScroll}
            />
          </div>
        )}
        <div
          className="markdown-editor-renderer-container"
          style={{display: isEditing ? "none" : "grid"}}
        >
          {pAllowEdit && (<div className="d-flex d-justify-end">
            <StyledButton
              icon={ASSETS.icons.action.edit.black}
              onClick={handleEditStart}
            >
              Edit
            </StyledButton>
          </div>)}
          <div>
            {(markdown.trimStart().length > 0 ) ? renderMarkdown(markdown, formatKey("")) : (
              <div {...theme("script-c", "markdown-editor-start-suggestion")}>
                {pAllowEdit && (<>Click "Edit" to start taking notes.</>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </MarkdownContext.Provider>
  );
}
