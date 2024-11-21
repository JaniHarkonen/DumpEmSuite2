type ListColumn<T> = {
  accessor: keyof T;
  caption: string;
}

type Props<T> = {
  columns: ListColumn<T>[];
  data: T[];
};

export default function TableList<T>(props: Props<T>) {
  const pColumns: ListColumn<T>[] = props.columns;
  const pData: T[] = props.data;

  return (
    <table className="text-align-left w-100 user-select-text">
      <thead>
        <tr>
          {pColumns.map((column: ListColumn<T>) => {
            return (
              <th key={"list-table-header-" + (column.accessor as string)}>
                {column.caption}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {pData.map((entry: T, index: number) => {
          return (
            <tr key={"list-table-row-" + index}>
              {pColumns.map((column: ListColumn<T>, index: number) => {
                const data = entry[column.accessor];
                return (
                  <td key={"list-table-data-" + index}>
                    {index === 0 ? 
                      (<><span><input type="checkbox" /></span>{data}</>) :
                      (<>{data}</>)
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
