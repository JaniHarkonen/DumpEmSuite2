import { createContext } from "react";
import { Company, Profile } from "src/shared/schemaConfig";


export type ProfileEditChanges = {
  company: Company;
  attributes: (keyof Profile)[];
  values: string[];
};

export type OnEditProfile = (changes: ProfileEditChanges) => void;

export type ProfileContextType = {
  profile: Profile | null;
  company: Company | null;
  onEditProfile?: OnEditProfile;
};

export const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  company: null
});
