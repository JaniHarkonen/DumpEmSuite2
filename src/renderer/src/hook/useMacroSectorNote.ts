import { useState } from "react";
import useDatabase from "./useDatabase";
import { BoundDatabaseAPI, FetchResult } from "src/shared/database.type";
import { Filteration } from "src/shared/schemaConfig";


type Props = {
  macroSectorID: string;
};

type Returns = {
  macroSectorNote: string | null;
  fetchMacroSectorNote: () => void;
  postMacroSectorNoteChange: (value: string) => void;
  databaseAPI: BoundDatabaseAPI;
};

export default function useMacroSectorNote(props: Props): Returns {
  const pMacroSectorID: string = props.macroSectorID;
  const databaseAPI = useDatabase().databaseAPI!;

  const [macroSectorNote, setMacroSectorNote] = useState<string | null>("");

  const fetchMacroSectorNote = () => {
    databaseAPI.fetchMacroSectorNote({ macroSectorID: pMacroSectorID })
    .then((result: FetchResult<Filteration>) => {
      setMacroSectorNote(result.rows[0]?.notes ?? null)
    });
  };

  const postMacroSectorNoteChange = (notes: string) => {
    databaseAPI.postMacroSectorNoteChanges({
      macroSectorID: pMacroSectorID,
      notes
    });
  };

  return {
    macroSectorNote,
    fetchMacroSectorNote,
    postMacroSectorNoteChange,
    databaseAPI
  };
}
