import MaterialsBrowser, { MaterialsBrowserProps } from "@renderer/components/MaterialsBrowser/MaterialsBrowser";
import PageContainer from "@renderer/components/PageContainer/PageContainer";
import PageHeader from "@renderer/components/PageHeader/PageHeader";
import { ReactNode } from "react";


type Props = {
  sectorCaption: string;
} & MaterialsBrowserProps;

export default function MacroSectorMaterialsView(props: Props): ReactNode {
  const pSectorCaption: string = props.sectorCaption;
  const pDirectoryPath: string = props.directoryPath;

  return (
    <PageContainer>
      <div className="grid-auto-top">
        <PageHeader>{pSectorCaption + " materials"}</PageHeader>
        <MaterialsBrowser directoryPath={pDirectoryPath} />
      </div>
    </PageContainer>
  );
}
