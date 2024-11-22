import { WorkspaceContext, WorkspaceContextType } from "@renderer/context/WorkspaceContext";
import { useContext } from "react";
import { BoundDatabaseAPI } from "../../../shared/database.type";


type Returns = {
  databaseAPI?: BoundDatabaseAPI;
};

export default function useDatabase(): Returns {
  const {databaseAPI} = useContext<WorkspaceContextType>(WorkspaceContext);
  return { databaseAPI };
}
