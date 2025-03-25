import { SearchData } from "@renderer/hook/useSearch2";
import { TableListColumn, TableListDataCell } from "./TableList";


export default function toSearchData<T>(
  columns: TableListColumn<T>[], dataCells: TableListDataCell<T>[]
): SearchData {
  const searchData: SearchData = {};

  if( columns.length > 0 ) {
    for( let column of columns ) {
      searchData[column.accessor as string] = [];
    }
  
    for( let i = 0; i < columns.length; i++ ) {
      const dataCell: TableListDataCell<T> = dataCells[i];

      for( let j = 0; j < columns.length; j++ ) {
        const accessor: string = columns[j].accessor as string;
        if( dataCells[i] ) {
          searchData[accessor].push(dataCell.data[accessor] as string);
        }
      }
    }
  }

  return searchData;
}
