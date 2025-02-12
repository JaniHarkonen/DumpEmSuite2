import "./StyledInput.css";
import useTheme from "@renderer/hook/useTheme";
import copyJSON from "@renderer/utils/copyJSON";
import { HTMLProps, MutableRefObject, ReactNode } from "react";


type Props = {
  reactRef?: MutableRefObject<HTMLInputElement | null>;
} & HTMLProps<HTMLInputElement>

export default function StyledInput(props: Props): ReactNode {
  const pClassName: string = props.className || "";
  const pRef: MutableRefObject<HTMLInputElement | null> | undefined = props.reactRef ?? undefined;

  const {theme} = useTheme();

  return (
    <input
      {...copyJSON(props, ["reactRef"])}
      {...theme("baseline-bgc", "glyph-c", "line-height-standard",  pClassName)}
      {...pRef && {ref: pRef}}
    />
  );
}
