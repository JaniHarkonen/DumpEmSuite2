import useEditable from "@renderer/hook/useEditable";
import { markdownProcessor } from "@renderer/model/markdown";
import { ChangeEvent, useState } from "react";


export default function MarkdownNote() {
  const [
    isEditing,
    handleEditStart,
    handleFinalize
  ] = useEditable({});
  const [markdown, setMarkdown] = useState<string>("");

  return(
    <div
      className="w-100 h-100"
      onDoubleClick={handleEditStart}
    >
      {isEditing ? (
        <textarea
          className="w-100 h-100"
          onBlur={handleFinalize}
          autoFocus={true}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMarkdown(e.target.value)}
          value={markdown}
        />
      ) : (
        <div className="user-select-text">
          <strong><em>test</em></strong>
          {markdownProcessor(markdown)}
        </div>
      )}
    </div>
  );
}
