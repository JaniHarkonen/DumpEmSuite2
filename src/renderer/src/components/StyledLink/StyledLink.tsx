import useExternalLinks from "@renderer/hook/useExternalLinks";
import useTheme from "@renderer/hook/useTheme";
import { HTMLProps, ReactNode } from "react";


type Props = {
  children?: ReactNode;
} & HTMLProps<HTMLSpanElement>;

export default function StyledLink(props: Props): ReactNode {
  const pClassName: string = props.className || "";
  const pHREF: string = props.href || "";
  const pChildren: ReactNode = props.children;

  const {theme} = useTheme();
  const {openLink} = useExternalLinks();

  return (
    <span
      {...props}
      {...theme("action-c", "cursor-pointer", pClassName)}
      role="link"
      onClick={() => openLink(pHREF)}
    >
      {pChildren}
    </span>
  );
}
