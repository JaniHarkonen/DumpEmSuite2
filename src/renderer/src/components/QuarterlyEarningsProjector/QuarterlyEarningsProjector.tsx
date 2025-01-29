import "./QuarterlyEarningsProjector.css";

import { MarkdownContext } from "@renderer/context/MarkdownContext";
import StyledInput from "../StyledInput/StyledInput";

import { ChangeEvent, MouseEvent, ReactNode, useContext, useEffect, useState } from "react";
import { ASTNode } from "@renderer/model/markdown/parser";
import useTabKeys from "@renderer/hook/useTabKeys";


export type QuarterlyEarningsProjectorState = {
  quarters: string[];
  enableAutoFill: boolean;
};

type State = QuarterlyEarningsProjectorState;

type Props = {
  idNode?: ASTNode;
  dataNode?: ASTNode[];
  contentStart?: number;
  contentEnd?: number;
};

const DEFAULT_STATE: QuarterlyEarningsProjectorState = {
  quarters: [],
  enableAutoFill: false
};

export default function QuarterlyEarningsProjector(props: Props): ReactNode {
  const pIDNode: ASTNode | undefined = props.idNode;
  const pDataNode: ASTNode[] | undefined = props.dataNode;

  const [componentState, setComponentState] = useState<State>(DEFAULT_STATE);

  const {markdown, onComponentChange} = useContext(MarkdownContext);
  const {formatKey} = useTabKeys();

  const componentID: string = pIDNode?.children[0]?.value || "";

  useEffect(() => {
    if( pDataNode ) {
      setComponentState((prev: State) => {
        return {
          ...prev,
          quarters: pDataNode.map((data: ASTNode) => data.children[0]?.value || "")
        }
      });
    }
  }, [componentID, pDataNode, markdown]);

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

      // Fix the markdown and post it
    let updatedMarkdown: string = markdown;

    for( let i = pDataNode!.length - 1; i >= 0; i-- ) {
      const contentStart: number = pDataNode![i].contentPositionStart ?? -1;
      const contentEnd: number = pDataNode![i].contentPositionEnd ?? -1;
      updatedMarkdown = (
        updatedMarkdown.substring(0, contentStart) + 
        next.quarters[i] + 
        updatedMarkdown.substring(contentEnd)
      );
    }

    setComponentState(next);
    onComponentChange(updatedMarkdown);
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
        <span>
          <strong>{label}:</strong>
        </span>
        <StyledInput 
          className="w-100"
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

  if( componentID === "" ) {
    return (
      <div>
        Invalid <strong>quarterly earnings projector</strong> ID!
      </div>
    );
  }

  if( !pDataNode ) {
    return (
      <div>
        Missing data in <strong>quarterly earnings projector</strong>!
      </div>
    );
  }

  return (
    <div
      className="w-100"
      onDoubleClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
    >
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
