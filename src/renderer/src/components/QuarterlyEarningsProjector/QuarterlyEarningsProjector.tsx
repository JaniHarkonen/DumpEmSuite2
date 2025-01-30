import "./QuarterlyEarningsProjector.css";

import { MarkdownContext } from "@renderer/context/MarkdownContext";

import { ChangeEvent, ReactNode, useContext, useEffect, useState } from "react";
import { ASTNode } from "@renderer/model/markdown/parser";
import useTabKeys from "@renderer/hook/useTabKeys";
import { fixMarkdown } from "@renderer/model/markdown/utils";
import InputPanel from "../InputPanel/InputPanel";


type Props = {
  idNode?: ASTNode;
  dataNode?: ASTNode[];
  contentStart?: number;
  contentEnd?: number;
};

type State = {
  quarters: string[];
  enableAutoFill: boolean;
};

const DEFAULT_STATE: State = {
  quarters: [],
  enableAutoFill: false
};

export default function QuarterlyEarningsProjector(props: Props): ReactNode {
  const pDataNode: ASTNode[] | undefined = props.dataNode;

  const [componentState, setComponentState] = useState<State>(DEFAULT_STATE);

  const {markdown, onComponentChange} = useContext(MarkdownContext);
  const {formatKey} = useTabKeys();

  useEffect(() => {
    if( pDataNode ) {
      setComponentState((prev: State) => {
        return {
          ...prev,
          quarters: pDataNode.map((data: ASTNode) => data.children[0]?.value || "")
        };
      });
    }
  }, [pDataNode, markdown]);

  const handleComponentChange = (quarterIndex: number, value: string) => {
    const numericValue: number = parseFloat(value);
    const next: State = { ...componentState };

    if( isNaN(numericValue) ) {
      next.quarters[quarterIndex] = value;
      setComponentState(next);
      return;
    }

    next.quarters[quarterIndex] = value;
    
      // Perform auto interpolation, if active
    if( componentState.enableAutoFill ) {
      const linearAdd: number = numericValue / (quarterIndex + 1);

      for( let i = quarterIndex + 1; i < componentState.quarters.length; i++ ) {
        next.quarters[i] = "" + (parseFloat(next.quarters[i - 1]) + linearAdd);
      }
    }

    setComponentState(next);
    
       // Fix markdown with the updated values and post
    onComponentChange(fixMarkdown(markdown, next.quarters, pDataNode));
  };

  const handleAutoFillChange = (e: ChangeEvent<HTMLInputElement>) => {
    setComponentState((prev: State) => {
      const next: State = {
        ...prev,
        enableAutoFill: e.target.checked
      };

      return next;
    });
  };

  const renderQuarterInput = (label: string, quarterIndex: number) => {
    const value: string = componentState.quarters[quarterIndex];
    const difference: string = (
      "" + (parseFloat(value) - parseFloat(componentState.quarters[quarterIndex - 1] ?? 0))
    );
    
    return (
      <div
        key={formatKey("quarterly-earnings-projector-quarter-" + quarterIndex)}
        className="w-100"
      >
        <InputPanel 
          label={label}
          type="text"
          value={componentState.quarters[quarterIndex] || ""}
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

  if( !pDataNode ) {
    return (
      <div>
        Missing data in <strong>quarterly earnings projector</strong>!
      </div>
    );
  }

  return (
    <div className="w-100">
      <div className="quarterly-earnigns-projector-container">
        {pDataNode.map((data: ASTNode, index: number) => {
          return renderQuarterInput("Q1" + (index > 0 ? "–Q" + (index + 1) : ""), index);
        })}
      </div>
      <div className="d-flex gap-medium-length">
        <input
          type="checkbox"
          checked={componentState.enableAutoFill}
          onChange={handleAutoFillChange}
        />
        <span>Auto-interpolate</span>
      </div>
    </div>
  );
}
