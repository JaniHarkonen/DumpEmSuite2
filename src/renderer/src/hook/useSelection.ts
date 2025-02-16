import { useState } from "react";


export type SelectionID = number | string;

export type SelectionItem<T> = {
  id: SelectionID;
  data: T,
};

export type SelectionSet<T> = {
  [id: SelectionID]: {
    isSelected: boolean;
    item: SelectionItem<T>
  };
}; 

type HandleSelection<T> = (isSelected: boolean, ...selection: SelectionItem<T>[]) => void;
type GetIDs = () => SelectionID[];

type Props<T> = {
  defaultSeletionSet?: SelectionSet<T>;
};

type Returns<T> = {
  selectionSet: SelectionSet<T>;
  handleSelection: HandleSelection<T>;
  handleSelectionUntil: HandleSelection<T>;
  handleSelectionAfter: HandleSelection<T>;
  getSelectedIDs: GetIDs;
  getUnselectedIDs: GetIDs;
  resetSelection: () => void;
};

export default function useSelection<T>(props: Props<T>): Returns<T> {
  const pDefaultSelection: SelectionSet<T> = props.defaultSeletionSet || {};
  const [selectionSet, setSelectionSet] = useState<SelectionSet<T>>(pDefaultSelection);

  const handleSelection = (isSelected: boolean, ...selection: SelectionItem<T>[]) => {
    setSelectionSet((prev: SelectionSet<T>) => {
      const newSelection: SelectionSet<T> = { ...prev };
      for( let item of selection ) {
        newSelection[item.id] = {
          isSelected,
          item
        };
      }
      return newSelection;
    });
  };

  const handleSelectionUntil = (isSelected: boolean, ...selectableItems: SelectionItem<T>[]) => {
    for( let i = 0; i < selectableItems.length; i++ ) {
      if( selectionSet[selectableItems[i].id] ) {
        handleSelection(isSelected, ...selectableItems.slice(0, i));
        return;
      }
    }

    handleSelection(isSelected, ...selectableItems);
  };

  const handleSelectionAfter = (isSelected: boolean, ...selectableItems: SelectionItem<T>[]) => {
    for( let i = 0; i < selectableItems.length; i++ ) {
      if( selectionSet[selectableItems[i].id] ) {
        handleSelection(isSelected, ...selectableItems.slice(i, selectableItems.length));
        return;
      }
    }

    handleSelection(isSelected, ...selectableItems);
  };

  const resetSelection = () => setSelectionSet({});

  const getSelectedIDs: GetIDs = () => {
    return Object.keys(selectionSet).filter((key: string) => selectionSet[key].isSelected);
  };

  const getUnselectedIDs: GetIDs = () => {
    return Object.keys(selectionSet).filter((key: string) => !selectionSet[key].isSelected);
  };

  return {
    selectionSet,
    handleSelection,
    handleSelectionUntil,
    handleSelectionAfter,
    getSelectedIDs,
    getUnselectedIDs,
    resetSelection
  };
}
