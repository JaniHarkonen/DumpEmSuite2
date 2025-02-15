import { TabsContext } from "@renderer/context/TabsContext";
import copyJSON from "@renderer/utils/copyJSON";
import { HTMLProps, MutableRefObject, ReactNode, useContext } from "react";


type Props = {
  reactRef?: MutableRefObject<HTMLSelectElement | null>;
} & HTMLProps<HTMLSelectElement>

export default function StyledSelect(props: Props): ReactNode {
  const pClassName: string = props.className || "";
  const pChildren: ReactNode = props.children;
  const pRef: MutableRefObject<HTMLSelectElement | null> | undefined = props.reactRef ?? undefined;

  const {tabIndex} = useContext(TabsContext);

  return (
    <select
      {...copyJSON(props, ["reactRef"])}
      {...pRef && {ref: pRef}}
      className={pClassName}
      tabIndex={tabIndex()}
    >
      {pChildren}
    </select>
  );
}
