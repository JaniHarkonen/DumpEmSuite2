import "./TableList.css";

import { SelectionSet, SelectionItem } from "@renderer/hook/useSelection";
import { ChangeEvent, ReactNode } from "react";
import EditableText from "../editable/EditableText";
import useTabKeys from "@renderer/hook/useTabKeys";
import { ASSETS } from "@renderer/assets/assets";
import { SortOrder } from "@renderer/hook/useSortedData";


export type TableListColumn<T> = {
  accessor: keyof T;
  caption: string;
  ElementConstructor?: (
    dataCell: TableListDataCell<T>, 
    column: TableListColumn<T>, 
    index: number
  ) => ReactNode;
  formatter?: (
    data: T,
    dataCell: TableListDataCell<T>, 
    column: TableListColumn<T>, 
    index: number
  ) => string;
  sortOrder?: SortOrder;
};

export type TableListDataCell<T> = SelectionItem<T>;

export type EditChanges<T> = {
  columns: (keyof T)[];
  values: string[];
};

export type OnColumnSelect<T> = (column: TableListColumn<T>) => void;
export type OnItemFocus<T> = (dataCell: TableListDataCell<T>) => void;
export type OnItemSelect<T> = 
  (dataCell: TableListDataCell<T>, isChecked: boolean) => void;
export type OnItemFinalize<T> = 
  (dataCell: TableListDataCell<T>, changes: EditChanges<T>) => void;

type Props<T> = {
  columns: TableListColumn<T>[];
  cells: TableListDataCell<T>[];
  allowSelection?: boolean;
  allowEdit?: boolean;
  selectionSet?: SelectionSet<T>;
  onColumnSelect?: OnColumnSelect<T>;
  onItemFocus?: OnItemFocus<T>;
  onItemSelect?: OnItemSelect<T>;
  onItemFinalize?: OnItemFinalize<T>;
};

export type TableListProps<T> = Props<T>;

export default function TableList<T>(props: Props<T>): ReactNode {
  const pColumns: TableListColumn<T>[] = props.columns;
  const pData: TableListDataCell<T>[] = props.cells;
  const pAllowSelection: boolean = props.allowSelection ?? false;
  const pAllowEdit: boolean = props.allowEdit ?? false;
  const pSelectionSet: SelectionSet<T> = props.selectionSet || {};
  const pOnColumnSelect: OnColumnSelect<T> = props.onColumnSelect || function(){ };
  const pOnItemFocus: OnItemFocus<T> = props.onItemFocus || function(){ };
  const pOnItemSelect: OnItemSelect<T> = props.onItemSelect || function(){ };
  const pOnItemFinalize: OnItemFinalize<T> = props.onItemFinalize || function(){ };

  const {formatKey} = useTabKeys();

  const renderDataCell = (
    dataCell: TableListDataCell<T>, column: TableListColumn<T>, index: number
  ) => {
      // Use the element constructor, if one has been provided
    if( column.ElementConstructor ) {
      return column.ElementConstructor(dataCell, column, index);
    }
    
      // Apply input fields, if editing
    const data = dataCell.data[column.accessor] as string;
    let dataElement: ReactNode = (
      <EditableText
        value={data}
        onFinalize={(value: string) => pOnItemFinalize(dataCell, {
          columns: [column.accessor], 
          values: [value]
        })}
        editDisabled={!pAllowEdit}
      >
        {column.formatter ? column.formatter(dataCell.data, dataCell, column, index) : data}
      </EditableText>
    );

      // Apply selection checkbox, if first data cell
    if( pAllowSelection && index === 0 ) {
      dataElement = (
        <div className="table-list-data-cell-container">
          <input
            className="mr-strong-length"
            type="checkbox"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              pOnItemSelect(dataCell, e.target.checked);
            }}
            checked={pSelectionSet[dataCell.id]?.isSelected ?? false}
          />
          {dataElement}
        </div>
      );
    }

    return (
      <div
        key={formatKey("list-table-data-" + (column.accessor as String) + "-" + dataCell.id)}
        className={(index + 1) % pColumns.length === 0 && index > 0 ? "text-align-right" : ""}
        onClick={() => pOnItemFocus(dataCell)}
      >
        {dataElement}
      </div>
    );
  };
  
  return (
    <div
      className="table-list-container"
      style={{ gridTemplateColumns: "repeat(" + pColumns.length + ", auto)" }}
    >
      {pColumns.map((column: TableListColumn<T>, index: number) => {
        return (
          <div 
            key={formatKey("list-table-header-" + (column.accessor as string))}
            className={
              (index === pColumns.length - 1) ? 
              "text-align-right table-list-column-header-container" : 
              "table-list-column-header-container"
            }
          >
            <span
              role="button"
              onClick={() => pOnColumnSelect(column)}
            >
              <strong>{column.caption}</strong>
            </span>
            <span className="ml-medium-length">
              {(column.sortOrder === "ascending") && (
                <img className="size-tiny-icon" src={ASSETS.icons.buttons.arrow.up.black} />
              )} 
              {(column.sortOrder === "descending") && (
                <img className="size-tiny-icon" src={ASSETS.icons.buttons.arrow.down.black} />
              )}
            </span>
          </div>
        );
      })}
      {pData.map((dataCell: TableListDataCell<T>) => {
        return pColumns.map((column: TableListColumn<T>, index: number) => {
          return renderDataCell(dataCell, column, index);
        });
      })}
    </div>
  );
}
