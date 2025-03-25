import { BoundDatabaseAPI, FetchResult, PostResult } from "src/shared/database.type";
import useDatabase from "./useDatabase";
import { Company, Profile } from "src/shared/schemaConfig";
import { ProfileContextType, ProfileEditChanges } from "@renderer/context/ProfileContext";
import { useEffect, useState } from "react";
import useViewEvents from "./useViewEvents";
import { CompanyWithCurrency } from "./useWorkspaceCompanies";
import useExtraInfo from "./useExtraInfo";


type Returns = {
  profileSelection: ProfileContextType;
  fetchCompanyProfile: (company: Company) => void;
  handleProfileEdit: (changes: ProfileEditChanges) => void;
  handleProfileSelection: (company: Company | null) => void;
};

export default function useProfileSelection(): Returns {
  const {subscribe, unsubscribe} = useViewEvents();
  const {extraInfo, setExtraInfo} = useExtraInfo();
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

  const handleProfileSelection = (company: Company | null) => {
    if( company ) {
      fetchCompanyProfile(company);
    } else {
      setProfileSelection({
        profile: null,
        company: null
      });
    }

    setExtraInfo && setExtraInfo({selectedCompany: company ? company : null});
  };

  useEffect(() => {
    const companyRemoved = (result: CompanyWithCurrency[]) => {
      for( let company of result ) {
        if( company.company_id === profileSelection.company?.company_id ) {
          handleProfileSelection(null);
          break;
        }
      }
    };

    if( extraInfo ) {
      if( extraInfo.selectedCompany?.company_id !== profileSelection.company?.company_id ) {
        fetchCompanyProfile(extraInfo.selectedCompany);
      }
    }

    subscribe("company-removed", companyRemoved);
    return () => unsubscribe("company-removed", companyRemoved);
  }, [profileSelection, extraInfo]);

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

  return {
    profileSelection,
    fetchCompanyProfile,
    handleProfileEdit,
    handleProfileSelection
  };
}
