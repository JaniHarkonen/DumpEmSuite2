import { ReactNode, useContext } from "react";
import MaterialsBrowser from "../MaterialsBrowser/MaterialsBrowser";
import { ProfileContext } from "@renderer/context/ProfileContext";
import { RELATIVE_APP_PATHS } from "../../../../../src/shared/appConfig";
import { WorkspaceContext } from "@renderer/context/WorkspaceContext";
import CompanyNotSelected from "../CompanyNotSelected/CompanyNotSelected";


export default function FundamentalMaterials(): ReactNode {
  const {company} = useContext(ProfileContext);
  const {workspacePath} = useContext(WorkspaceContext);

  if( !company || !workspacePath ) {
    return <CompanyNotSelected />;
  }

  const getMaterialsPath = () => {
    return RELATIVE_APP_PATHS.make.fundamental(workspacePath, company.company_id.toString());
  }

  return (
    <MaterialsBrowser directoryPath={getMaterialsPath()} />
  );
}
