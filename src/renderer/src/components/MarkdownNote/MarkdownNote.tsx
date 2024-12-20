import useEditable from "@renderer/hook/useEditable";
import { renderMarkdown } from "@renderer/model/markdown/markdown";
import { FocusEvent, KeyboardEvent, MutableRefObject, useRef, useState } from "react";
import PageContainer from "../PageContainer/PageContainer";


export default function MarkdownNote() {
  const [markdown, setMarkdown] = useState<string>("");
  
  const [
    isEditing,
    handleEditStart,
    handleFinalize
  ] = useEditable<string>({
    onFinalize: (value: string) => setMarkdown(value)
  });

  const textAreaRef: MutableRefObject<HTMLTextAreaElement | null> = 
    useRef<HTMLTextAreaElement | null>(null);

  const handleTab = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if( e.key === "Tab" ) {
      e.preventDefault();

      const target: HTMLTextAreaElement = e.currentTarget;
      const selectionStart: number = target.selectionStart;

      target.value = target.value.substring(0, selectionStart) + "\t" + target.value.substring(selectionStart);
      target.selectionStart = selectionStart + 1;
      target.selectionEnd = selectionStart + 1;
    }
  };

  return(
    <PageContainer>
      <div
        className="w-100 h-100"
        onDoubleClick={handleEditStart}
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
    </PageContainer>
  );
}
