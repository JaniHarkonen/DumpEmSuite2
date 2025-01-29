import { ReactNode } from "react";
import StyledInput from "../StyledInput/StyledInput";


export type AnnualEarningsProjectorState = {
  
};

type State = AnnualEarningsProjectorState;

type Props = {
  componentID: string | undefined;
  years: string | number | undefined;
  startYear: string | number | undefined;
}

export default function AnnualEarningsProjector(props: Props): ReactNode {
  const pComponentID: string = props.componentID || "";
  const pYears: number = parseInt(props.years + "");
  const pStartYear: number = parseInt(props.startYear + "");

  if( pComponentID === "" ) {
    return (
      <div>
        Invalid <strong>annual earnings projector</strong> ID!
      </div>
    );
  }

  if( isNaN(pYears) ) {
    return (
      <div>
        Invalid number of years for <strong>annual earnings projector</strong>!
      </div>
    );
  }

  if( isNaN(pStartYear) ) {
    return (
      <div>
        Invalid starting year for <strong>annual earnings projector</strong>!
      </div>
    );
  }

  return (
    <div className="d-flex gap-medium-length w-100">
      <div className="w-100">
        <span>
          <strong>Market cap:</strong>
        </span>
        <StyledInput 
          className="w-100"
        />
        <span>
          <strong>Cashflow start:</strong>
        </span>
        <StyledInput
          className="w-100"
        />
      </div>
      {}
    </div>
  );
}