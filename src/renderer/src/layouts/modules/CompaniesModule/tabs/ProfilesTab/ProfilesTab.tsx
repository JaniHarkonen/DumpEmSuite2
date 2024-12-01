import ModuleView from "@renderer/components/ModuleView/ModuleView";
import { SceneContext } from "@renderer/context/SceneContext";
import { SplitTreeBlueprint } from "@renderer/model/splits";
import { Tab, TabBlueprint, TabContentProvider } from "@renderer/model/tabs";
import { useContext, useState } from "react";
import useSceneConfig from "@renderer/hook/useSceneConfig";
import CompanyProfile from "@renderer/components/CompanyProfile/CompanyProfile";
import CompanyProfilesList from "@renderer/components/CompanyProfilesList/CompanyProfilesList";
import useDatabase from "@renderer/hook/useDatabase";
import { CompanyWithCurrency } from "@renderer/hook/useWorkspaceCompanies";
import { TableListDataCell } from "@renderer/components/TableList/TableList";
import { Company, Profile } from "src/shared/schemaConfig";
import { BoundDatabaseAPI, FetchResult, PostResult } from "src/shared/database.type";
import { ProfileContext, ProfileContextType, ProfileEditChanges } from "@renderer/context/ProfileContext";


export default function ProfilesTab() {
  const [profileSelection, setProfileSelection] = useState<ProfileContextType>({
    profile: null,
    company: null
  });

  const {handleSplitTreeUpdate} = useSceneConfig();
  const {sceneConfig} = useContext(SceneContext);
  const sceneBlueprint: SplitTreeBlueprint = sceneConfig.splitTree;
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

  const handleCompanyListingFocus = (
    dataCell: TableListDataCell<CompanyWithCurrency>
  ) => {
    fetchCompanyProfile(dataCell.data);
  };

  const tabsProvider: TabContentProvider = {
    getContent: (tab: Tab | TabBlueprint ) => {
      switch( tab.contentTemplate ) {
        case "view-company-list": return (
          <CompanyProfilesList onCompanySelect={handleCompanyListingFocus}/>
        );
        case "view-chart": return <>chart</>;
        case "view-company-profile": return (
          <CompanyProfile />
        );
      }
      return <>failed</>;
    }
  };


  return (
    <ProfileContext.Provider value={profileSelection}>
      <ModuleView
        splitTreeBlueprint={sceneBlueprint}
        contentProvider={tabsProvider}
        onUpdate={handleSplitTreeUpdate}
      />
    </ProfileContext.Provider>
  );
}
