import "./CompanyTag.css";

import { ASSETS } from "@renderer/assets/assets";
import useEditable from "@renderer/hook/useEditable";
import { ChangeEvent, FocusEvent, KeyboardEvent, ReactNode, useState } from "react";
import { Tag } from "src/shared/schemaConfig";


export type OnTagSelect = (tag: Tag) => void;

type OnCompanyTagUpdate = (updatedTag: Tag) => void;
type OnCompanyTagRemove = (tag: Tag) => void;

type Props = {
  tag: Tag;
  onUpdate?: OnCompanyTagUpdate;
  onRemove?: OnCompanyTagRemove;
  onSelect?: OnTagSelect;
  allowEdit?: boolean;
};

export default function CompanyTag(props: Props): ReactNode {
  const pTag: Tag = props.tag;
  const pOnUpdate: OnCompanyTagUpdate = props.onUpdate || function(){ };
  const pOnRemove: OnCompanyTagRemove = props.onRemove || function(){ };
  const pOnSelect: OnTagSelect = props.onSelect || function(){ };
  const pAllowEdit: boolean = props.allowEdit ?? false;

  const [isEditing, handleStartEdit, handleFinalize, handleEnter] = useEditable<Tag>({ onFinalize: pOnUpdate });
  const [tag, setTag] = useState<Tag>(pTag);


  const handleChangeColor = (e: ChangeEvent<HTMLInputElement>) => {
    setTag({
      ...tag,
      tag_hex: e.target.value
    });
  };

  const handleChangeLabel = (e: ChangeEvent<HTMLInputElement>) => {
    setTag({
      ...tag,
      tag_label: e.target.value
    });
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    if( !e.relatedTarget ) {
      handleFinalize(tag);
    }
  };


  return (
    <div
      className="d-flex d-align-items-center"
      onDoubleClick={() => pAllowEdit && handleStartEdit()}
      onBlur={handleBlur}
      onClick={() => pOnSelect(tag)}
    >
      {isEditing ? (
        <>
          <input
            type="color"
            value={tag.tag_hex}
            onChange={handleChangeColor}
            onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => handleEnter(e.code, tag)}
          />
          <input
            value={tag.tag_label || ""}
            onChange={handleChangeLabel}
            onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => handleEnter(e.code, tag)}
            autoFocus={true}
          />
          <button onClick={() => pOnRemove(tag)}>
            <span>
              <img
                className="size-tiny-icon company-tag-control-remove"
                src={ASSETS.icons.buttons.trashCan.white}
              />
            </span>
          </button>
        </>
      ) : (
        <>
          <span
            className="size-tiny-icon mr-norm"
            style={{ backgroundColor: tag.tag_hex }}
          />
          {tag.tag_label}
        </>
      )}
    </div>
  );
}
