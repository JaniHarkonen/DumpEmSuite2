import useDatabase from "@renderer/hook/useDatabase";
import { ReactNode, useEffect, useState } from "react";
import { BoundDatabaseAPI, FetchResult } from "src/shared/database.type";
import { FilterationStep } from "src/shared/schemaConfig";


type OnFiltrationStepSelect = (filtrationStep: FilterationStep) => void;

type FiltrationStepTable = {
  [key in string]: FilterationStep;
};

type BlackListedStepMap = {
  [key in string]: boolean;
}

type Props = {
  blackListedMap?: BlackListedStepMap;
  onSelect?: OnFiltrationStepSelect;
};

export default function FiltrationStepSelection(props: Props): ReactNode {
  
}
