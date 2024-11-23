import { ChangeEvent, ReactNode } from "react";


export type ListColumn<T> = {
  accessor: keyof T;
  caption: string;
};

type OnColumnSelect<T> = (column: ListColumn<T>) => void;
type OnItemFocus<T> = (item: T) => void;
type OnItemSelect<T> = (item: T, isChecked: boolean) => void;

type Props<T> = {
  columns: ListColumn<T>[];
  data: T[];
  allowSelection?: boolean;
  onColumnSelect?: OnColumnSelect<T>;
  onItemFocus?: OnItemFocus<T>;
  onItemSelect?: OnItemSelect<T>;
};

export type TableListProps<T> = Props<T>;

export default function TableList<T>(props: Props<T>): ReactNode {
  const pColumns: ListColumn<T>[] = props.columns;
  const pData: T[] = props.data;
  const pAllowSelection: boolean = props.allowSelection || false;
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
        {pData.map((item: T, index: number) => {
          return (
            <tr
              key={"list-table-row-" + index}
              onClick={() => pOnItemFocus(item)}
            >
              {pColumns.map((column: ListColumn<T>, index: number) => {
                const data = item[column.accessor];
                return (
                  <td key={"list-table-data-" + index}>
                    {pAllowSelection && index === 0 ? (
                        <>
                          <input
                            type="checkbox"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => pOnItemSelect(item, e.target.checked)}
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
