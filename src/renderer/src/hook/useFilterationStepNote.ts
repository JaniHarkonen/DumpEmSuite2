import { useState } from "react";
import useDatabase from "./useDatabase";
import { BoundDatabaseAPI, FetchResult } from "src/shared/database.type";
import { Filteration } from "src/shared/schemaConfig";


type Props = {
  filterationStepID: string;
};

type Returns = {
  filterationNote: string | null;
  fetchFilterationNote: (companyID: string) => void;
  postFilterationNoteChange: (companyID: string, value: string) => void;
  databaseAPI: BoundDatabaseAPI;
};

export default function useFilterationStepNote(props: Props): Returns {
  const pFilterationStepID: string = props.filterationStepID;
  const databaseAPI = useDatabase().databaseAPI!;

  const [filterationNote, setFilterationNote] = useState<string | null>("");

  const fetchFilterationNote = (companyID: string) => {
    databaseAPI.fetchFilterationStepNote({
      filterationStepID: pFilterationStepID,
      companyID
    }).then((result: FetchResult<Filteration>) => {
      setFilterationNote(result.rows[0]?.notes ?? null)
    });
  };

  const postFilterationNoteChange = (companyID: string, value: string) => {
    databaseAPI.postFilterationNoteChanges({
      filterationStepID: pFilterationStepID,
      companyID,
      value
    });
  };

  return {
    filterationNote,
    fetchFilterationNote,
    postFilterationNoteChange,
    databaseAPI
  };
}
