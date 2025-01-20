import useDatabase from "@renderer/hook/useDatabase";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { BoundDatabaseAPI, FetchResult } from "src/shared/database.type";
import { FilterationStep } from "src/shared/schemaConfig";
import StyledButton from "../StyledButton/StyledButton";


type OnFiltrationSubmit = (filtrationStep: FilterationStep, preserveTags: boolean) => void;

type FiltrationStepTable = {
  [key in string]: FilterationStep;
};

type BlackListedStepMap = {
  [key in string]: boolean;
}

type Props = {
  blackListedMap?: BlackListedStepMap;
  onSubmit?: OnFiltrationSubmit;
};

export default function FiltrationSubmitForm(props: Props): ReactNode {
  const pBlackListedMap: BlackListedStepMap = props.blackListedMap || {};
  const pOnSubmit: OnFiltrationSubmit = props.onSubmit || function() {};

  const [filtrationSteps, setFiltrationSteps] = useState<FiltrationStepTable>({});
  const [submitTarget, setSubmitTarget] = useState<FilterationStep | null>(null);
  const [preserveTags, setPreserveTags] = useState<boolean>(false);

  const databaseAPI: BoundDatabaseAPI = useDatabase().databaseAPI!;

  useEffect(() => {
    databaseAPI.fetchAllFiltrationSteps().then((result: FetchResult<FilterationStep>) => {
      const stepTable: FiltrationStepTable = {};
      result.rows
      .filter((step: FilterationStep) => !pBlackListedMap[step.step_id])
      .forEach((step: FilterationStep) => stepTable[step.step_id] = step);
      setFiltrationSteps(stepTable);
      setSubmitTarget(stepTable[Object.keys(stepTable)[0]] ?? null);
    });
  }, []);

  const handleSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubmitTarget(filtrationSteps[e.target.value]);
  };

  const handleSubmit = () => {
    if( submitTarget ) {
      pOnSubmit(submitTarget, preserveTags);
    }
  };

  return (
    <div className="d-flex">
      <StyledButton onClick={handleSubmit}>
        Submit
      </StyledButton>
      <select onChange={handleSelection}>
        {Object.keys(filtrationSteps).map((key: string) => {
          return (
            <option
              key={"filtration-step-selection-option-" + key}
              value={key}
            >
              {filtrationSteps[key].caption}
            </option>
          );
        })}
      </select>
      <input
        type="checkbox"
        onChange={(e: ChangeEvent<HTMLInputElement>) => setPreserveTags(e.target.checked)}
      /> Preserve tags
    </div>
  );
}
