import { useState } from "react";
import { Tag } from "src/shared/schemaConfig";
import useDatabase from "./useDatabase";
import { BoundDatabaseAPI, DeleteResult, FetchResult, PostResult } from "src/shared/database.type";
import { CompanyTagEditChanges } from "@renderer/components/TagPanel/TagPanel";
import { AsString } from "src/shared/utils";


type Returns = {
  tags: Tag[];
  fetchAllTags: () => void;
  updateTag: (changes: CompanyTagEditChanges) => void;
  removeTag: (tag: Tag) => void;
  addTag: (tag: AsString<Tag>) => void;
  databaseAPI: BoundDatabaseAPI;
};

export default function useFiltertionTags(): Returns {
  const databaseAPI = useDatabase().databaseAPI!;
  const [tags, setTags] = useState<Tag[]>([]);

  const fetchAllTags = () => {
    databaseAPI.fetchAllTags().then((result: FetchResult<Tag>) => setTags(result.rows));
  };


  const addTag = (tag: AsString<Tag>) => {
    databaseAPI.postNewTag({ tag })
    .then((result: PostResult) => {
      if( result.wasSuccessful ) {
        fetchAllTags();
      }
    });
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

  
  return {
    tags,
    fetchAllTags,
    addTag,
    updateTag,
    removeTag,
    databaseAPI
  };
}