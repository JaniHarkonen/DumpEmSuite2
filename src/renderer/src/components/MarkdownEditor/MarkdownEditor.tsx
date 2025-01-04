import useEditable from "@renderer/hook/useEditable";
import { renderMarkdown } from "@renderer/model/markdown/markdown";
import { FocusEvent, KeyboardEvent, MutableRefObject, useEffect, useRef, useState } from "react";


type OnSaveNoteChanges = (value: string) => void;

type Props = {
  initialValue?: string;
  onSaveChange?: OnSaveNoteChanges;
};

export default function MarkdownEditor(props: Props) {
  const pInitialValue: string = props.initialValue || "";
  const pOnSaveChanges: OnSaveNoteChanges = props.onSaveChange || function(){ };

  const [markdown, setMarkdown] = useState<string>("");
  
  const [
    isEditing,
    handleEditStart,
    handleFinalize
  ] = useEditable<string>({
    onFinalize: (value: string) => setMarkdown(value)
  });

  useEffect(() => setMarkdown(pInitialValue), [pInitialValue]);

  const textAreaRef: MutableRefObject<HTMLTextAreaElement | null> = 
    useRef<HTMLTextAreaElement | null>(null);

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
    } else if( e.ctrlKey && e.key.toLowerCase() === "s" ) {
      e.preventDefault();
      pOnSaveChanges(target.value);
    }
  };

  return (
    <div
      onDoubleClick={handleEditStart}
      className="w-100 h-100"
    >
      {isEditing && (
        <textarea
          className="w-100 h-100"
          onBlur={(e: FocusEvent<HTMLTextAreaElement>) => handleFinalize(e.target.value)}
          autoFocus={true}
          defaultValue={markdown}
          onKeyDown={handleTab}
          ref={textAreaRef}
        />
      )}
        <div
          className="user-select-text"
          style={{display: isEditing ? "none" : "block"}}
        >
          {renderMarkdown(markdown)}
        </div>
    </div>
  );
}
