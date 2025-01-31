import MarkdownEditor from "@renderer/components/MarkdownEditor/MarkdownEditor";
import PageContainer from "@renderer/components/PageContainer/PageContainer";
import PageHeader from "@renderer/components/PageHeader/PageHeader";
import useMacroSectorNote from "@renderer/hook/useMacroSectorNote";
import { ReactNode, useEffect } from "react";
import { MacroSector } from "src/shared/schemaConfig";


type Props = {
  macroSector: MacroSector;
};

export default function MacroSectorNotesView(props: Props): ReactNode {
  const pMacroSector: MacroSector = props.macroSector;

  const {
    macroSectorNote,
    fetchMacroSectorNote,
    postMacroSectorNoteChange
  } = useMacroSectorNote({
    macroSectorID: pMacroSector.sector_id
  });

  useEffect(() => {
    fetchMacroSectorNote();
  }, [pMacroSector]);

  return (
    <PageContainer>
      <div className="grid-auto-top">
        <PageHeader>{pMacroSector.sector_name}</PageHeader>
        <MarkdownEditor
          initialValue={macroSectorNote || ""}
          onSaveChange={(value: string) => postMacroSectorNoteChange(value)}
        />
      </div>
    </PageContainer>
  );
}
