import { ReactNode, useContext } from "react";
import MaterialsBrowser from "../MaterialsBrowser/MaterialsBrowser";
import { ProfileContext } from "@renderer/context/ProfileContext";
import { RELATIVE_APP_PATHS } from "../../../../../src/shared/appConfig";
import { WorkspaceContext } from "@renderer/context/WorkspaceContext";


export default function FundamentalMaterials(): ReactNode {
  const {profile, company} = useContext(ProfileContext);
  const {workspacePath} = useContext(WorkspaceContext);

  if( !company || !profile || !workspacePath ) {
    return <>Please, select a company...</>;
  }

  const getMaterialsPath = () => {
    return RELATIVE_APP_PATHS.make.fundamental(workspacePath, company.company_id.toString());
  }

  return (
    <MaterialsBrowser 
      directoryPath={getMaterialsPath()}
    />
  );
}
