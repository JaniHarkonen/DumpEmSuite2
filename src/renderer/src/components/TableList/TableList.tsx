import { SelectionSet, SelectionItem } from "@renderer/hook/useSelection";
import { ChangeEvent, ReactNode } from "react";
import EditableText from "../EditableText/EditableText";


export type TableListColumn<T> = {
  accessor: keyof T;
  caption: string;
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
  const pAllowSelection: boolean = props.allowSelection || false;
  const pAllowEdit: boolean = props.allowEdit || false;
  const pSelectionSet: SelectionSet<T> = props.selectionSet || {};
  const pOnColumnSelect: OnColumnSelect<T> = props.onColumnSelect || function(){ };
  const pOnItemFocus: OnItemFocus<T> = props.onItemFocus || function(){ };
  const pOnItemSelect: OnItemSelect<T> = props.onItemSelect || function(){ };
  const pOnItemFinalize: OnItemFinalize<T> = props.onItemFinalize || function(){ };

  const renderDataCell = (
    dataCell: TableListDataCell<T>, column: TableListColumn<T>, index: number
  ) => {
      // Apply input fields, if editing
    const data = dataCell.data[column.accessor];
    let dataElement: ReactNode = (
      <EditableText
        value={data as string}
        onFinalize={(value: string) => pOnItemFinalize(dataCell, {
          columns: [column.accessor], 
          values: [value]
        })}
        editDisabled={!pAllowEdit}
      >
        {data as string}
      </EditableText>
    );

      // Apply selection checkbox, if first data cell
    if( pAllowSelection && index === 0 ) {
      dataElement = (
        <>
          <input
            type="checkbox"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              pOnItemSelect(dataCell, e.target.checked)
            }}
            checked={pSelectionSet[dataCell.id]?.isSelected || false}
          />
          {dataElement}
        </>
      );
    }

    return (
      <td key={"list-table-data-" + (column.accessor as String) + "-" + dataCell.id}>
        {dataElement}
      </td>
    );
  };

  
  return (
    <table className="text-align-left w-100 user-select-text">
      <thead>
        <tr>
          {pColumns.map((column: TableListColumn<T>) => {
            return (
              <th
                key={"list-table-header-" + (column.accessor as string)}
                onClick={() => pOnColumnSelect(column)}
              >
                {column.caption}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {pData.map((dataCell: TableListDataCell<T>) => {
          return (
            <tr
              key={"list-table-row-" + dataCell.id}
              onClick={() => pOnItemFocus(dataCell)}
            >
              {pColumns.map((column: TableListColumn<T>, index: number) => {
                return renderDataCell(dataCell, column, index);
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
