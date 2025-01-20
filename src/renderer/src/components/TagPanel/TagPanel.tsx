import "./TagPanel.css";

import { ReactNode, useEffect } from "react";
import CompanyTag, { OnTagSelect } from "./CompanyTag/CompanyTag";
import { Tag } from "src/shared/schemaConfig";
import generateRandomUniqueID from "@renderer/utils/generateRandomUniqueID";
import useFiltertionTags from "@renderer/hook/useFiltertionTags";
import StyledButton from "../StyledButton/StyledButton";


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

  const {
    tags,
    fetchAllTags,
    addTag,
    updateTag,
    removeTag
  } = useFiltertionTags();

  useEffect(() => fetchAllTags(), []);

  const handleNewTag = () => {
    addTag({
      tag_id: "",
      tag_hex: "#000000",
      tag_label: generateRandomUniqueID("Tag ")
    });
  }


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
        <StyledButton onClick={handleNewTag}>{"+"}</StyledButton>
      </div>
    </>
  );
}
