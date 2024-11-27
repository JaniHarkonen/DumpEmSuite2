import { ReactNode, useContext } from "react";
import EditableText from "../EditableText/EditableText";
import EditableTextArea from "../EditableText/EditableTextArea";
import PageContainer from "../PageContainer/PageContainer";
import PageHeader from "../PageHeader/PageHeader";
import { ProfileContext } from "@renderer/context/ProfileContext";
import { Profile } from "src/shared/schemaConfig";



export default function CompanyProfile(): ReactNode {
  const {profile, company, onEditProfile} = useContext(ProfileContext);

  if( !profile || !company ) {
    return <></>;
  }

  const sector: string = profile.sector || "";
  const investorsURL: string = profile.investors_url || "";
  const presence: string = profile.presence || "";
  const description: string = profile.profile_description || "";

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
      <div className="user-select-text">
        <h4>Sector</h4>
        <EditableText
          value={sector}
          onFinalize={(value: string) => handleEditProfile("sector", value)}
        >
          {sector}
        </EditableText>
        <h4>Investors page</h4>
        <EditableText
          value={investorsURL}
          onFinalize={(value: string) => handleEditProfile("investors_url", value)}
        >
          {investorsURL}
        </EditableText>
        <h4>Presence</h4>
        <EditableText
          value={presence}
          onFinalize={(value: string) => handleEditProfile("presence", value)}
        >
          {presence}
        </EditableText>
        <h3>Description</h3>
        <EditableTextArea
          value={description}
          onFinalize={(value: string) => handleEditProfile("profile_description", value)}
        >
          {description}
        </EditableTextArea>
      </div>
    </PageContainer>
  );
}
