import { ReactNode, useContext } from "react";
import EditableText from "../editable/EditableText";
import PageContainer from "../PageContainer/PageContainer";
import PageHeader from "../PageHeader/PageHeader";
import { ProfileContext } from "@renderer/context/ProfileContext";
import { Profile } from "src/shared/schemaConfig";
import Container from "../Container/Container";
import CompanyNotSelected from "../CompanyNotSelected/CompanyNotSelected";
import MarkdownEditor from "../MarkdownEditor/MarkdownEditor";
import StyledLink from "../StyledLink/StyledLink";


type Props = {
  allowEdit?: boolean;
};

export default function CompanyProfile(props: Props): ReactNode {
  const pAllowEdit: boolean = props.allowEdit ?? false;
  const {profile, company, onEditProfile} = useContext(ProfileContext);

  if( !company ) {
    return <CompanyNotSelected />;
  }

  const sector: string = profile?.sector || "none";
  const investorsURL: string = profile?.investors_url || "none";
  const presence: string = profile?.presence || "none";
  const description: string = profile?.profile_description || "";

  const handleEditProfile = (attribute: keyof Profile, value: string) => {
    onEditProfile && onEditProfile({
      company,
      attributes: [attribute],
      values: [value]
    });
  };
  
  return (
    <PageContainer>
      <PageHeader>{company.company_name as string}</PageHeader>
      <Container className="user-select-text">
        <h4>Sector</h4>
        <EditableText
          value={sector}
          onFinalize={(value: string) => handleEditProfile("sector", value)}
          editDisabled={!pAllowEdit}
        >
          {sector}
        </EditableText>
        <h4>Investors page</h4>
        <EditableText
          value={investorsURL}
          onFinalize={(value: string) => handleEditProfile("investors_url", value)}
          editDisabled={!pAllowEdit}
        >
          <StyledLink href={investorsURL}>{investorsURL}</StyledLink>
        </EditableText>
        <h4>Presence</h4>
        <EditableText
          value={presence}
          onFinalize={(value: string) => handleEditProfile("presence", value)}
          editDisabled={!pAllowEdit}
        >
          {presence}
        </EditableText>
        <h3>Description</h3>
        <div className="aspect-ratio-16-9 w-100">
          <MarkdownEditor
            initialValue={description}
            onSaveChange={(value: string) => handleEditProfile("profile_description", value)}
            allowEdit={pAllowEdit}
          />
        </div>
      </Container>
    </PageContainer>
  );
}
