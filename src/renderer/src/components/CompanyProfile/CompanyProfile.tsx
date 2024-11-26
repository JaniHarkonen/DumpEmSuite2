import { ReactNode } from "react";
import { Profile } from "src/shared/schemaConfig";
import EditableText from "../EditableText/EditableText";
import EditableTextArea from "../EditableText/EditableTextArea";


type Props = {
  profile: Profile;
};

export default function CompanyProfile(props: Props): ReactNode {
  const pProfile: Profile = props.profile;
  const sector: string = pProfile.sector || "";
  const investorsURL: string = pProfile.investors_url || "";
  const presence: string = pProfile.presence || "";
  const description: string = pProfile.profile_description || "";

  
  return (
    <div>
      <h4>Sector</h4>
      <EditableText value={sector}>{sector}</EditableText>
      <h4>Investors page</h4>
      <EditableText value={investorsURL}>{investorsURL}</EditableText>
      <h4>Presence</h4>
      <EditableText value={presence}>{presence}</EditableText>
      <h2>Description</h2>
      <EditableTextArea value={description}>{description}</EditableTextArea>
    </div>
  );
}
