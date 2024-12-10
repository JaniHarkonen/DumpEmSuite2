import "./TagPanel.css";

import { ReactNode, useEffect, useState } from "react";
import CompanyTag, { OnTagSelect } from "./CompanyTag/CompanyTag";
import { BoundDatabaseAPI, DeleteResult, FetchResult, PostResult } from "src/shared/database.type";
import useDatabase from "@renderer/hook/useDatabase";
import { Tag } from "src/shared/schemaConfig";
import generateRandomUniqueID from "@renderer/utils/generateRandomUniqueID";


export type CompanyTagEditChanges = {
  updatedTag: Tag;
};

export type OnCompanyTagEdit = (changes: CompanyTagEditChanges) => void;

type Props = {
  allowEdit?: boolean;
  onTagSelect?: OnTagSelect;
}

export default function TagPanel(props: Props): ReactNode {
  const pAllowEdit: boolean = props.allowEdit ?? true;
  const pOnTagSelect: OnTagSelect = props.onTagSelect || function(){ };

  const databaseAPI: BoundDatabaseAPI = useDatabase().databaseAPI!;
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => fetchAllTags(), []);

  const fetchAllTags = () => {
    databaseAPI.fetchAllTags().then((result: FetchResult<Tag>) => setTags(result.rows));
  };

  const updateTag = (changes: CompanyTagEditChanges) => {
    databaseAPI.postTagChanges({
      updatedTag: changes.updatedTag,
    }).then((result: PostResult) => {
      if( result.wasSuccessful ) {
        fetchAllTags();
      }
    });
  };

  const removeTag = (tag: Tag) => {
    databaseAPI.deleteTag({ tag })
    .then((result: DeleteResult) => {
      if( result.wasSuccessful ) {
        fetchAllTags();
      }
    });
  };

  const handleTagAdd = () => {
    databaseAPI.postNewTag({
      tag: {
        tag_id: "",
        tag_hex: "#000000",
        tag_label: generateRandomUniqueID("Tag ")
      }
    }).then((result: PostResult) => {
      if( result.wasSuccessful ) {
        fetchAllTags();
      }
    });
  };


  return (
    <>
      <div className="tag-panel-tag-container">
        {tags.map((tag: Tag, index: number) => {
          return (
            <div
              key={"tag-panel-tag-" + tag.tag_id}
              className="mr-strong"
            >
              <CompanyTag
                tag={tag}
                onUpdate={(updatedTag: Tag) => updateTag({ updatedTag })}
                onRemove={removeTag}
                onSelect={pOnTagSelect}
                allowEdit={pAllowEdit && index !== 0}
              />
            </div>
          );
        })}
        <button onClick={handleTagAdd}>{"+"}</button>
      </div>
    </>
  );
}
