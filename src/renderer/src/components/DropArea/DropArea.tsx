import { ReactNode } from "react";


type DimensionProvider = (containerValue: number) => number;

export type DropAreaHighlight = {
  element: ReactNode;
  left: string;
  right: string;
  top: string;
  bottom: string;
};

export type DropAreaSettings = {
  id: string;
  activation: {
    left: DimensionProvider;
    right: DimensionProvider;
    top: DimensionProvider;
    bottom: DimensionProvider;
  };
  highlight: DropAreaHighlight;
};

type Props = {
  highlight: DropAreaHighlight;
};

export default function DropArea(props: Props): ReactNode {
  const pHighlight: DropAreaHighlight = props.highlight;

  return (
    <div
      style={{
        position: "absolute",
        left: pHighlight.left,
        right: pHighlight.right,
        top: pHighlight.top,
        bottom: pHighlight.bottom
      }}
    >
      {pHighlight.element}
    </div>
  );
}
