import { SelectionSet, SelectionItem } from "@renderer/hook/useSelection";
import { ChangeEvent, ReactNode } from "react";


export type ListColumn<T> = {
  accessor: keyof T;
  caption: string;
};

export type TableListDataCell<T> = SelectionItem<T>;

type OnColumnSelect<T> = (column: ListColumn<T>) => void;
type OnItemFocus<T> = (dataCell: TableListDataCell<T>) => void;
type OnItemSelect<T> = (dataCell: TableListDataCell<T>, isChecked: boolean) => void;

type Props<T> = {
  columns: ListColumn<T>[];
  cells: TableListDataCell<T>[];
  allowSelection?: boolean;
  selectionSet?: SelectionSet<T>;
  onColumnSelect?: OnColumnSelect<T>;
  onItemFocus?: OnItemFocus<T>;
  onItemSelect?: OnItemSelect<T>;
};

export type TableListProps<T> = Props<T>;

export default function TableList<T>(props: Props<T>): ReactNode {
  const pColumns: ListColumn<T>[] = props.columns;
  const pData: TableListDataCell<T>[] = props.cells;
  const pAllowSelection: boolean = props.allowSelection || false;
  const pSelectionSet: SelectionSet<T> = props.selectionSet || {};
  const pOnColumnSelect: OnColumnSelect<T> = props.onColumnSelect || function(){ };
  const pOnItemFocus: OnItemFocus<T> = props.onItemFocus || function(){ };
  const pOnItemSelect: OnItemSelect<T> = props.onItemSelect || function(){ };

  return (
    <table className="text-align-left w-100 user-select-text">
      <thead>
        <tr>
          {pColumns.map((column: ListColumn<T>) => {
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
        {pData.map((dataCell: TableListDataCell<T>, index: number) => {
          return (
            <tr
              key={"list-table-row-" + index}
              onClick={() => pOnItemFocus(dataCell)}
            >
              {pColumns.map((column: ListColumn<T>, index: number) => {
                const data = dataCell.data[column.accessor];
                return (
                  <td key={"list-table-data-" + index}>
                    {pAllowSelection && index === 0 ? (
                        <>
                          <input
                            type="checkbox"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              pOnItemSelect(dataCell, e.target.checked)
                            }}
                            checked={pSelectionSet[dataCell.id]?.isSelected || false}
                          />
                          {data}
                        </>
                      ) : (<>{data}</>)
                    }
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
