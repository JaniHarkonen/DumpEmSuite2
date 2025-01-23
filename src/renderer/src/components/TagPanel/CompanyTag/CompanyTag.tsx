import "./CompanyTag.css";

import StyledButton from "@renderer/components/StyledButton/StyledButton";
import { ASSETS } from "@renderer/assets/assets";
import useEditable from "@renderer/hook/useEditable";
import { ChangeEvent, FocusEvent, KeyboardEvent, ReactNode, useState } from "react";
import { Tag } from "src/shared/schemaConfig";
import StyledInput from "@renderer/components/StyledInput/StyledInput";


export type OnTagSelect = (tag: Tag) => void;

type OnCompanyTagUpdate = (updatedTag: Tag) => void;
type OnCompanyTagRemove = (tag: Tag) => void;

type Props = {
  tag: Tag;
  onUpdate?: OnCompanyTagUpdate;
  onRemove?: OnCompanyTagRemove;
  onSelect?: OnTagSelect;
  allowEdit?: boolean;
  isSelected?: boolean;
  displayLabel?: boolean;
};

export default function CompanyTag(props: Props): ReactNode {
  const pTag: Tag = props.tag;
  const pOnUpdate: OnCompanyTagUpdate = props.onUpdate || function(){ };
  const pOnRemove: OnCompanyTagRemove = props.onRemove || function(){ };
  const pOnSelect: OnTagSelect = props.onSelect || function(){ };
  const pAllowEdit: boolean = props.allowEdit ?? false;
  const pIsSelected: boolean = props.isSelected ?? false;
  const pDisplayLabel: boolean = props.displayLabel ?? true;

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
    >
      {isEditing ? (
        <>
          <input
            type="color"
            value={tag.tag_hex}
            onChange={handleChangeColor}
            onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => handleEnter(e.code, tag)}
          />
          <StyledInput
            type="text"
            value={tag.tag_label || ""}
            onChange={handleChangeLabel}
            onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => handleEnter(e.code, tag)}
            autoFocus={true}
          />
          <StyledButton onClick={() => pOnRemove(tag)}>
            <span>
              <img
                className="size-tiny-icon company-tag-control-remove"
                src={ASSETS.icons.buttons.trashCan.white}
              />
            </span>
          </StyledButton>
        </>
      ) : (
        <>
          <span
            className={"company-tag-color mr-medium-length" + (pIsSelected ? " active" : "")}
            style={{ backgroundColor: tag.tag_hex }}
            role="button"
            onClick={() => pOnSelect(tag)}
          />
          {pDisplayLabel && tag.tag_label}
        </>
      )}
    </div>
  );
}
