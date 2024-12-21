import MarkdownEditor from "@renderer/components/MarkdownEditor/MarkdownEditor";
import PageContainer from "@renderer/components/PageContainer/PageContainer";
import { ProfileContext } from "@renderer/context/ProfileContext";
import useFilterationStepNote from "@renderer/hook/useFilterationStepNote";
import { ReactNode, useContext, useEffect } from "react";


type Props = {
  filterationStepID: string;
};

export default function FilterationNote(props: Props): ReactNode {
  const pFilterationStepID: string = props.filterationStepID;

  const {company} = useContext(ProfileContext);

  const {
    filterationNote,
    fetchFilterationNote,
    postFilterationNoteChange
  } = useFilterationStepNote({
    filterationStepID: pFilterationStepID
  });

  useEffect(() => {
    if( company ) {
      fetchFilterationNote(company.company_id.toString());
    }
  }, [company]);

  const handleFilterationNoteChange = (value: string) => {
    if( company ) {
      postFilterationNoteChange(company.company_id.toString(), value);
    }
  };

  return (
    <PageContainer>
      <MarkdownEditor
        initialValue={filterationNote || ""}
        onSaveChange={handleFilterationNoteChange}
      />
    </PageContainer>
  );
}
