import "./StyledTextarea.css";

import useTheme from "@renderer/hook/useTheme";
import { HTMLProps, KeyboardEvent, KeyboardEventHandler, ReactNode } from "react";


type Props = {
} & HTMLProps<HTMLTextAreaElement>;

export default function StyledTextarea(props: Props): ReactNode {
  const pClassName = props.className || "";
  const pOnKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = props.onKeyDown || function(){ };

  const {theme} = useTheme();

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const target: HTMLTextAreaElement = e.currentTarget;

    if( e.key === "Tab" ) {
      e.preventDefault();
        
      let selectionStart: number = target.selectionStart;
      let selectionEnd: number = target.selectionEnd;
      const isShiftDown: boolean = e.shiftKey;

        // If a section is selected, append tabs in front of each new line character
        // (unless the new line is followed by another new line)
        // (this is also triggered by SHIFT + TAB)
      if( selectionEnd - selectionStart > 0 || isShiftDown ) {
          // Find the beginning of the first line in the selection
        for( let i = selectionStart - 1; i >= 0; i-- ) {
          selectionStart = i;

          if( target.value.charAt(i) === "\n" ) {
            break;
          }
        }

        let fixedValue: string = target.value.substring(0, selectionStart);

          // Unindent
        if( isShiftDown ) {
          for( let i = selectionStart; i <= selectionEnd; i++ ) {
            const charAt: string = target.value.charAt(i);
            
            if( charAt === "\t" && (i === 0 || target.value.charAt(i - 1) === "\n") ) {
              continue;
            }

            fixedValue += charAt;
          }
        } else {
            // Indent
          selectionEnd--;
          for( let i = selectionStart; i <= selectionEnd; i++ ) {
            const charAt: string = target.value.charAt(i);
            fixedValue += charAt;
  
            if( i === 0 ) {
              fixedValue = "\t" + fixedValue;
            } else if( charAt === "\n" && target.value.charAt(i + 1) !== "\n" ) {
              fixedValue += "\t";
            }
          }
        }

        target.value = fixedValue + target.value.substring(selectionEnd + 1);
        target.selectionStart = selectionStart;
        target.selectionEnd = selectionEnd;
      } else {
        // Apply tab to the textarea and fix the cursor position
        target.value = 
          target.value.substring(0, selectionStart) + "\t" + 
          target.value.substring(selectionStart);
        target.selectionStart = selectionStart + 1;
        target.selectionEnd = selectionStart + 1;
      }
    }

    pOnKeyDown(e);
  };

  return (
    <textarea
      {...props}
      {...theme("outline-bgc", "glyph-c", pClassName)}
      onKeyDown={handleKeyDown}
    />
  );
}
