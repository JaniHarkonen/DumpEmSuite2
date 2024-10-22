import "./AdjustableGrid.css";

export type AdjustableGridDirection = {
  flexDirection: "row" | "column";
  resize: "horizontal" | "vertical";
};

type AdjustableGridDirections = {
  horizontal: AdjustableGridDirection;
  vertical: AdjustableGridDirection;
};

export const DIRECTIONS: AdjustableGridDirections = {
  horizontal: {
    flexDirection: "row", 
    resize: "horizontal"
  },
  vertical: {
    flexDirection: "column",
    resize: "vertical"
  }
};

type AdjustableGridProps = {
  direction?: AdjustableGridDirection;
  children?: React.ReactNode | React.ReactNode[];
};

export default function AdjustableGrid(props: AdjustableGridProps) {
  const pDirection: AdjustableGridDirection = props?.direction || DIRECTIONS.horizontal;
  const pChildren: React.ReactNode | React.ReactNode[] = props?.children || <></>;

  return (
    <div 
      className="adjustable-grid" 
      style={{ flexDirection: pDirection.flexDirection }}
    >
      <div 
        className="adjustable-div debug-bg-green w-100" 
        style={{ resize: pDirection.resize }}
      >
        {pChildren[0] || pChildren || <></>}
      </div>
      <div className="adjustable-grid-vertical-item debug-bg-blue">{pChildren[1] || <></>}</div>
    </div>
  );
}
