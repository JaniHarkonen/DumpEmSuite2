import "./FilterationNote.css";

import CompanyNotSelected from "@renderer/components/CompanyNotSelected/CompanyNotSelected";
import Container from "@renderer/components/Container/Container";
import MarkdownEditor from "@renderer/components/MarkdownEditor/MarkdownEditor";
import PageContainer from "@renderer/components/PageContainer/PageContainer";
import PageHeader from "@renderer/components/PageHeader/PageHeader";
import { ProfileContext } from "@renderer/context/ProfileContext";
import useFilterationStepNote from "@renderer/hook/useFilterationStepNote";
import { ReactNode, useContext, useEffect } from "react";


type Props = {
  filtrationStepID: string;
};

export default function FiltrationNote(props: Props): ReactNode {
  const pFiltrationStepID: string = props.filtrationStepID;

  const {company} = useContext(ProfileContext);

  const {
    filterationNote,
    fetchFilterationNote,
    postFilterationNoteChange
  } = useFilterationStepNote({
    filterationStepID: pFiltrationStepID
  });

  useEffect(() => {
    if( company ) {
      fetchFilterationNote(company.company_id.toString());
    }
  }, [company]);

  const handleFiltrationStepNoteChange = (value: string) => {
    if( company ) {
      postFilterationNoteChange(company.company_id.toString(), value);
    }
  };

  return (
    <PageContainer>
      {company ? (
        <div className="grid-auto-top">
          <PageHeader>{company.company_name}</PageHeader>
          <Container className="filteration-note-markdown-editor-container">
            <MarkdownEditor
              initialValue={filterationNote || ""}
              onSaveChange={handleFiltrationStepNoteChange}
            />
          </Container>
        </div>
      ) : (
        <CompanyNotSelected />
      )}
    </PageContainer>
  );
}
