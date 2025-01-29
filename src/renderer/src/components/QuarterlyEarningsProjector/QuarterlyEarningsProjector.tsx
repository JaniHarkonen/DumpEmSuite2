import { MarkdownContext } from "@renderer/context/MarkdownContext";
import StyledInput from "../StyledInput/StyledInput";
import "./QuarterlyEarningsProjector.css";

import { ChangeEvent, MouseEvent, ReactNode, useContext, useEffect, useState } from "react";

export type QuarterlyEarningsProjectorState = {
  quarters: string[];
  enableAutoFill: boolean;
};

type State = QuarterlyEarningsProjectorState;

type Props = {
  componentID: string | undefined;
};

const DEFAULT_STATE: QuarterlyEarningsProjectorState = {
  quarters: ["", "", "", ""],
  enableAutoFill: true
};

export default function QuarterlyEarningsProjector(props: Props): ReactNode {
  const pComponentID: string = props.componentID?.trim() || "";
  const [componentState, setComponentState] = useState<State>(DEFAULT_STATE);
  const {componentData, onComponentChange} = useContext(MarkdownContext);

  useEffect(() => {
    if( pComponentID !== "" ) {
      setComponentState(componentData[pComponentID] || DEFAULT_STATE);
    }
  }, [pComponentID]);

  const handleComponentChange = (quarterIndex: number, value: string) => {
    setComponentState((prev: State) => {
      const numericValue: number = parseFloat(value);
      const next: State = { ...prev };

      if( isNaN(numericValue) ) {
        next.quarters[quarterIndex] = value;
        return next;
      }

      const linearAdd: number = numericValue / (quarterIndex + 1);
      next.quarters[quarterIndex] = value;
      
      if( prev.enableAutoFill ) {
        for( let i = quarterIndex + 1; i < componentState.quarters.length; i++ ) {
          next.quarters[i] = "" + (parseFloat(next.quarters[i - 1]) + linearAdd);
        }
      }

      onComponentChange(pComponentID, next);
      return next;
    });
  };

  const handleAutoFillChange = (e: ChangeEvent<HTMLInputElement>) => {
    setComponentState((prev: State) => {
      const next: State = {
        ...prev,
        enableAutoFill: e.target.checked
      };

      onComponentChange(pComponentID, next);
      return next;
    });
  };

  const renderQuarterInput = (label: string, quarterIndex: number) => {
    const value: string = componentState.quarters[quarterIndex];
    const difference: string = (
      "" + (parseFloat(value) - parseFloat(componentState.quarters[quarterIndex - 1] ?? 0))
    );
    
    return (
      <div className="w-100">
        <span>
          <strong>{label}:</strong>
        </span>
        <StyledInput 
          className="w-100"
          type="text"
          value={componentState.quarters[quarterIndex]}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            handleComponentChange(quarterIndex, e.target.value);
          }}
        />
        <span className="font-size-subscript">
          {difference}
        </span>
      </div>
    );
  };

  if( pComponentID === "" ) {
    return (
      <div>
        Invalid quarterly earnings projector ID!
      </div>
    );
  }

  return (
    <div
      className="w-100"
      onDoubleClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
    >
      <div className="quarterly-earnigns-projector-container">
        {renderQuarterInput("Q1", 0)}
        {renderQuarterInput("Q1-Q2", 1)}
        {renderQuarterInput("Q1-Q3", 2)}
        {renderQuarterInput("ANNUAL", 3)}
      </div>
      <div className="d-flex gap-medium-length">
        <input
          type="checkbox"
          checked={componentState.enableAutoFill}
          onChange={handleAutoFillChange}
        />
        <span>Auto-fill</span>
      </div>
    </div>
  );
}
