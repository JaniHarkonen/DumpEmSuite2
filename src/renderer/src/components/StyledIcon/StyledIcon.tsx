import useTheme from "@renderer/hook/useTheme";
import copyJSON from "@renderer/utils/copyJSON";
import { HTMLProps, ReactNode } from "react";


type Props = {
  enableFilter?: boolean;
  iconSize?: string;
} & HTMLProps<HTMLImageElement>;

export default function StyledIcon(props: Props): ReactNode {
  const pClassName: string = props.className || "";
  const pEnableFilter: boolean = props.enableFilter ?? true;
  const pIconSize: string = props.iconSize ?? "size-tiny-icon";
  
  const {theme} = useTheme();

  return (
    <img
      {...copyJSON<HTMLProps<HTMLImageElement>>(props, ["enableFilter", "iconSize"])}
      {...theme(pEnableFilter ? "glyph-svg" : "", pIconSize, pClassName)}
    />
  );
}
