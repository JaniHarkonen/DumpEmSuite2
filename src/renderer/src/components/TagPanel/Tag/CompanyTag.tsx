import "./Tag.css";
import EditableText from "@renderer/components/EditableText/EditableText";
import { ReactNode } from "react";
import { Tag } from "src/shared/schemaConfig";


type Props = {
  tag: Tag;
};

export default function CompanyTag(props: Props): ReactNode {
  const pTag: Tag = props.tag;
  const colorHex: string = "#" + pTag.tag_hex;
  const label: string = pTag.tag_label || "";

  return (
    <div className="d-flex d-align-items-center">
      <span
        className="company-tag-color-box mr-norm"
        style={{ backgroundColor: colorHex }}
      />
      <EditableText value={label}>
        {label}
      </EditableText>
    </div>
  );
}
