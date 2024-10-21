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
};

export default function AdjustableGrid(props: AdjustableGridProps) {
  const pDirection: AdjustableGridDirection = props.direction || DIRECTIONS.horizontal;

  return (
    <div 
      className="adjustable-grid" 
      style={{ flexDirection: pDirection.flexDirection }}
    >
      <div className="adjustable-div debug-bg-green" style={{ resize: pDirection.resize }}></div>
      <div className="adjustable-grid-vertical-item debug-bg-blue"></div>
    </div>
  );
}
