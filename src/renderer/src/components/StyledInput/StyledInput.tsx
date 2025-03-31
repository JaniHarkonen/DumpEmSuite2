import { TabsContext } from "@renderer/context/TabsContext";
import "./StyledInput.css";
import useTheme from "@renderer/hook/useTheme";
import copyJSON from "@renderer/utils/copyJSON";
import { HTMLProps, MutableRefObject, ReactNode, useContext } from "react";


type Props = {
  reactRef?: MutableRefObject<HTMLInputElement | null>;
} & HTMLProps<HTMLInputElement>

export type StyledInputProps = Props;

export default function StyledInput(props: Props): ReactNode {
  const pClassName: string = props.className || "";
  const pRef: MutableRefObject<HTMLInputElement | null> | undefined = props.reactRef ?? undefined;

  const {theme} = useTheme();
  const {tabIndex} = useContext(TabsContext);

  return (
    <input
      {...copyJSON(props, ["reactRef"])}
      {...theme("baseline-bgc", "glyph-c", "line-height-standard",  pClassName)}
      {...pRef && {ref: pRef}}
      tabIndex={Math.max(0, tabIndex())}
    />
  );
}
