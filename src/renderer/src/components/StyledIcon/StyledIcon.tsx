import useTheme from "@renderer/hook/useTheme";
import copyJSON from "@renderer/utils/copyJSON";
import { HTMLProps, ReactNode } from "react";


type Props = {
  enableFilter?: boolean;
} & HTMLProps<HTMLImageElement>;

export default function StyledIcon(props: Props): ReactNode {
  const pClassName: string = props.className || "";
  const pEnableFilter: boolean = props.enableFilter ?? true;
  
  const {theme} = useTheme();

  return (
    <img
      {...copyJSON<HTMLProps<HTMLImageElement>>(props, ["enableFilter"])}
      {...theme(pEnableFilter ? "glyph-svg" : "", pClassName + " size-tiny-icon")}
    />
  );
}
