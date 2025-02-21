import "./AnnualEarningsProjector.css";


import { ChangeEvent, ReactNode, useContext, useEffect, useState } from "react";
import { ASTNode } from "@renderer/model/markdown/parser";
import useTabKeys from "@renderer/hook/useTabKeys";
import { fixMarkdown } from "@renderer/model/markdown/utils";
import { MarkdownContext } from "@renderer/context/MarkdownContext";
import compoundInterest from "@renderer/utils/compoundInterest";
import approximateCompoundRate from "@renderer/utils/approximateCompoundRate";
import roundDecimals from "@renderer/utils/roundDecimals";
import InputPanel from "@renderer/components/InputPanel/InputPanel";
import { decimalFormatter } from "@renderer/utils/formatter";
import trimSpaces from "@renderer/utils/trimSpaces";


type StartingConditions = {
  marketCap: string;
  cashflow: string;
};

type Props = {
  yearsNode?: ASTNode;
  startYearNode?: ASTNode;
  marketCapNode?: ASTNode;
  cashflowNode?: ASTNode;
};

export default function AnnualEarningsProjector(props: Props): ReactNode {
  const pYearsNode: ASTNode | undefined = props.yearsNode;
  const pStartYearNode: ASTNode | undefined = props.startYearNode;
  const pMarketCapNode: ASTNode | undefined = props.marketCapNode;
  const pCashflowNode: ASTNode | undefined = props.cashflowNode;

  const [startConditions, setStartConditions] = useState<StartingConditions>({
    marketCap: "",
    cashflow: "",
  });

  const {markdown, onComponentChange} = useContext(MarkdownContext);

  useEffect(() => {
    if( pMarketCapNode && pCashflowNode ) {
      setStartConditions({
        marketCap: pMarketCapNode.children[0]?.value || "",
        cashflow: pCashflowNode.children[0]?.value || ""
      });
    }
  }, [
    pYearsNode, pStartYearNode, pMarketCapNode, pCashflowNode, markdown
  ]);

  const {formatKey} = useTabKeys();

  const years: number = parseInt("" + (pYearsNode?.children[0]?.value));
  const startYear: number = parseInt("" + (pStartYearNode?.children[0]?.value));
  const compoundRate: number = approximateCompoundRate(
    parseFloat(startConditions.cashflow), parseFloat(startConditions.marketCap), years, 0.0005
  );

  const handleChange = (value: string, field: keyof StartingConditions) => {
    const numeric: number = parseFloat(value);
    const data: StartingConditions = { ...startConditions };

    if( isNaN(numeric) ) {
      data[field] = value;
      setStartConditions(data);
      return;
    }

    data[field] = value;

    const updaterMarkdown: string = fixMarkdown(
      markdown, [data.marketCap, data.cashflow], [pMarketCapNode!, pCashflowNode!]
    );
    onComponentChange(updaterMarkdown);
    setStartConditions(data);
  };

  const renderProjections = () => {
    const projectionElements: ReactNode[] = [];

    for( let i = 1; i <= years; i++ ) {
      const numeric: number = 
        roundDecimals(compoundInterest(parseFloat(startConditions.cashflow), compoundRate, i), 2);
      projectionElements.push(
        <InputPanel
          key={formatKey("annual-earnings-projector-" + i)}
          label={startYear + i + "*"}
          readOnly={true}
          value={decimalFormatter("" + numeric)}
        />
      );
    }

    return projectionElements;
  };

  if( isNaN(years) ) {
    return (
      <div>
        Invalid number of years for <strong>annual earnings projector</strong>!
      </div>
    );
  }

  if( isNaN(startYear) ) {
    return (
      <div>
        Invalid starting year for <strong>annual earnings projector</strong>!
      </div>
    );
  }

  if( !pMarketCapNode ) {
    return (
      <div>
        Missing market cap attribute from <strong>annual earnings projector</strong>!
      </div>
    );
  }

  if( !pCashflowNode ) {
    return (
      <div>
        Missing cashflow attribute from <strong>annual earnings projector</strong>!
      </div>
    );
  }
  
  return (
    <div>
      <div className="annual-earnings-projector-controls-container">
        <div>
          <InputPanel 
            label="Market cap"
            value={startConditions.marketCap}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleChange(trimSpaces(e.target.value), "marketCap");
            }}
          />
          <InputPanel
            label="Cash flow start"
            value={startConditions.cashflow}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleChange(trimSpaces(e.target.value), "cashflow");
            }}
          />
          <InputPanel
            label="Annual earnings growth rate"
            value={roundDecimals(compoundRate * 100 - 100, 2) + "%"}
            readOnly={true}
          />
        </div>
        <div className="annual-earnings-projector-projections-row">
          <div className="annual-earnings-projector-projections-container">
            {renderProjections()}
          </div>
        </div>
      </div>
      <div className="d-flex d-justify-end mt-strong-length">
        <span>* iteratively calculated</span>
      </div>
    </div>
  );
}
