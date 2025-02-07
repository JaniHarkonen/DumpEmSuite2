import useTabKeys from "@renderer/hook/useTabKeys";
import checkIfHexBelowThreshold from "@renderer/utils/checkIfHexBelowThreshold";
import { ChangeEvent, ReactNode } from "react";
import { Tag } from "src/shared/schemaConfig";

type OnVerdictChange = (e: ChangeEvent<HTMLSelectElement>) => void;

type Props = {
  tags: Tag[];
  selectedTag?: Tag;
  optionKeyPrefix?: string;
  onChange?: OnVerdictChange;
};

export default function FiltrationVerdictSelection(props: Props): ReactNode {
  const pTags: Tag[] = props.tags;
  const pSelectedTag: Tag | undefined = props.selectedTag;
  const pOptionKeyPrefix: string = props.optionKeyPrefix || "";
  const pOnChange: OnVerdictChange = props.onChange || function(){ };

  const {formatKey} = useTabKeys();

  return (
    <select
      onChange={pOnChange}
      value={pSelectedTag?.tag_id || ""}
      style={{
        color: checkIfHexBelowThreshold(pSelectedTag?.tag_hex || "", 100) ? "white" : "black",
        backgroundColor: pSelectedTag?.tag_hex
      }}
    >
      {pTags.map((tag: Tag) => {
        return (
          <option
            key={formatKey(pOptionKeyPrefix + tag.tag_id)}
            style={{
              color: checkIfHexBelowThreshold(tag.tag_hex, 100) ? "white" : "black",
              backgroundColor: tag.tag_hex
            }}
            value={tag.tag_id}
          >
            {tag.tag_label}
          </option>
        );
      })}
    </select>
  );
}