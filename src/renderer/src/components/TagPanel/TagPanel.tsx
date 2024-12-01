import "./TagPanel.css";

import { ReactNode, useEffect, useState } from "react";
import CompanyTag from "./Tag/CompanyTag";
import { BoundDatabaseAPI, FetchResult } from "src/shared/database.type";
import useDatabase from "@renderer/hook/useDatabase";
import { Tag } from "src/shared/schemaConfig";


export default function TagPanel(): ReactNode {
  const databaseAPI: BoundDatabaseAPI = useDatabase().databaseAPI!;
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => fetchAllTags(), []);

  const fetchAllTags = () => {
    databaseAPI.fetchAllTags().then((result: FetchResult<Tag>) => setTags(result.rows));
  };

  return (
    <>
      <h4>Tags</h4>
      <div className="tag-panel-tag-container">
        {tags.map((tag: Tag) => {
          return (
            <div
              key={"tag-panel-tag-" + tag.tag_id}
              className="mr-strong"
            >
              <CompanyTag tag={tag} />
            </div>
          );
        })}
      </div>
    </>
  );
}
