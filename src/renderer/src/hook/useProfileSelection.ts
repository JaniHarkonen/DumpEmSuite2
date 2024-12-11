import { BoundDatabaseAPI, FetchResult, PostResult } from "src/shared/database.type";
import useDatabase from "./useDatabase";
import { Company, Profile } from "src/shared/schemaConfig";
import { ProfileContextType, ProfileEditChanges } from "@renderer/context/ProfileContext";
import { useState } from "react";


type Returns = {
  profileSelection: ProfileContextType;
  fetchCompanyProfile: (company: Company) => void;
  handleProfileEdit: (changes: ProfileEditChanges) => void;
  handleProfileSelection: (company: Company) => void;
};

export default function useProfileSelection(): Returns {
  const [profileSelection, setProfileSelection] = useState<ProfileContextType>({
    profile: null,
    company: null
  });
  const databaseAPI: BoundDatabaseAPI = useDatabase().databaseAPI!;

  const fetchCompanyProfile = (company: Company) => {
    databaseAPI.fetchCompanyProfile({ company: company })
    .then((result: FetchResult<Profile>) => {
      if( result.wasSuccessful ) {
        setProfileSelection({
          profile: result.rows[0],
          company,
          onEditProfile: handleProfileEdit
        });
      }
    });
  };

  const handleProfileEdit = (changes: ProfileEditChanges) => {
    databaseAPI.postCompanyProfileChanges({
      company: changes.company,
      attributes: changes.attributes,
      values: changes.values
    }).then((result: PostResult) => {
      if( result.wasSuccessful ) {
        fetchCompanyProfile(changes.company);
      }
    });
  };

  const handleProfileSelection = (company: Company) => {
    fetchCompanyProfile(company);
  };

  return {
    profileSelection,
    fetchCompanyProfile,
    handleProfileEdit,
    handleProfileSelection
  };
}
