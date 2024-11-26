import { SelectionSet, SelectionItem } from "@renderer/hook/useSelection";
import { ChangeEvent, FocusEvent, ReactNode, useState } from "react";


export type TableListColumn<T> = {
  accessor: keyof T;
  caption: string;
};

export type TableListDataCell<T> = SelectionItem<T>;

type Editable<T> = {
  column: TableListColumn<T>;
  data: T;
};

export type EditChanges<T> = {
  columns: (keyof T)[];
  values: string[];
};

type OnColumnSelect<T> = (column: TableListColumn<T>) => void;
type OnItemFocus<T> = (dataCell: TableListDataCell<T>) => void;
type OnItemSelect<T> = (dataCell: TableListDataCell<T>, isChecked: boolean) => void;
type OnItemFinalize<T> = (dataCell: TableListDataCell<T>, changes: EditChanges<T>) => void;

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

  const [editable, setEditable] = useState<Editable<T> | null>(null);

  const renderDataCell = (dataCell: TableListDataCell<T>, column: TableListColumn<T>, index: number) => {
    const data = dataCell.data[column.accessor];
    let dataDiv: ReactNode = <>{data}</>;

      // Apply input fields, if editing
    if( 
      pAllowEdit && editable?.data === dataCell.data && 
      editable.column === column
    ) {
      dataDiv = (
        <input
          defaultValue={data as string}
          onBlur={(e: FocusEvent<HTMLInputElement>) => {
            pOnItemFinalize(dataCell, {
              columns: [column.accessor], 
              values: [e.target.value]
            });
            setEditable(null);
          }}
          autoFocus={true}
        />
      );
    }

      // Apply selection checkbox, if first data cell
    if( pAllowSelection && index === 0 ) {
      dataDiv = (
        <>
          <input
            type="checkbox"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              pOnItemSelect(dataCell, e.target.checked)
            }}
            checked={pSelectionSet[dataCell.id]?.isSelected || false}
          />
          {dataDiv}
        </>
      );
    }

    return (
      <td
        key={"list-table-data-" + (column.accessor as String) + "-" + dataCell.id}
        onDoubleClick={() => setEditable({ column, data: dataCell.data})}
      >
        {dataDiv}
      </td>
    );
  }

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
