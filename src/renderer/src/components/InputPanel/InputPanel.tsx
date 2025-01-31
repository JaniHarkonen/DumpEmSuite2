import useTheme from "@renderer/hook/useTheme";
import { FocusEvent, HTMLProps, ReactNode } from "react";
import StyledInput from "../StyledInput/StyledInput";


type Props = {
  label: string;
  enableMaxWidth?: boolean;
  copyAllOnFocus?: boolean;
} & HTMLProps<HTMLInputElement>;

export default function InputPanel(props: Props): ReactNode {
  const pLabel: string = props.label;
  const pEnableMaxWidth: boolean = props.enableMaxWidth ?? true;
  const pCopyAllOnFocus: boolean = props.copyAllOnFocus ?? true;

  const {theme} = useTheme();

  const handleCopyAll = (e: FocusEvent<HTMLInputElement, HTMLElement>) => {
    if( pCopyAllOnFocus ) {
      e.target.select();
    }

    props.onFocus && props.onFocus(e);
  };

  return (
    <div className={"mb-medium-length " + ((pEnableMaxWidth) ? "w-100" : "")}>
      <span {...theme("script-c", "mb-medium-length")}>
        <strong>{pLabel}</strong>
      </span>
      <StyledInput
        {...props}
        className="w-100"
        onFocus={handleCopyAll}
      />
    </div>  
  );
}
