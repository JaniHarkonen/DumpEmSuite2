import { useEffect, useState } from "react";


type FieldType = "numeric" | "string";

type FieldTypeMap = {
  [key in string]: FieldType;
};

export type SortFieldTypeMap = FieldTypeMap;

type Props = {
  initialOrder: any[];
  fieldTypeMap: FieldTypeMap;
  sortField?: string;
  sortOrder?: SortOrder;
};

export type SortOrder = "ascending" | "descending" | "none";

type SortBy = (field: string, order?: SortOrder) => SortSettings;

export type SortSettings = {
  sortedData: any[];
  sortField: string | null;
  sortOrder: SortOrder;
};

type Returns = {
  sortBy: SortBy;
} & SortSettings;

export default function useSortedData(props: Props): Returns {
  const pInitialOrder: any[] = props.initialOrder;
  const pFieldTypeMap: FieldTypeMap = props.fieldTypeMap;
  const pSortField: string | null = props.sortField ?? null;
  const pSortOrder: SortOrder = props.sortOrder || "none";

  const [sorted, setSorted] = useState<SortSettings>({
    sortedData: pInitialOrder,
    sortField: pSortField,
    sortOrder: pSortOrder
  });

  useEffect(() => {
    setSorted((prev: SortSettings) => {
      return {
        ...prev,
        sortedData: pInitialOrder
      };
    });

    if( sorted.sortField ) {
      sortBy(sorted.sortField, sorted.sortOrder);
    }
  }, [pInitialOrder]);

  const sortBy = (field: string, order?: SortOrder) => {
      // If order is not provided, cycle between orders
    if( !order ) {
      if( field === sorted.sortField ) {
        if( sorted.sortOrder === "none" ) {
          order = "ascending";
        } else if( sorted.sortOrder === "ascending" ) {
          order = "descending";
        } else {
          order = "none";
        }
      } else {
        order = "ascending";
      }
    }

    if( order === "none" ) {
      const settings: SortSettings = {
        sortedData: pInitialOrder,
        sortField: null,
        sortOrder: "none"
      };
      setSorted(settings);
      return settings;
    }

      // THIS CAN BE CONVERTED INTO A SWITCH CASE WHEN/IF OTHER FIELD TYPES ARE NEEDED
    let array: any[];

    if( pFieldTypeMap[field.toString()] === "numeric" ) {
      array = [...pInitialOrder].sort((a: any, b: any) => a[field] - b[field]);
    } else {
      array = [...pInitialOrder].sort((a: any, b: any) => {
        for( let i = 0; i < Object.keys(pFieldTypeMap).length; i++ ) {
          const aCharCode: number = a[field].charCodeAt(i);
          const bCharCode: number = b[field].charCodeAt(i);

          if( aCharCode < bCharCode ) {
            return -1;
          } else if( aCharCode > bCharCode ) {
            return 1;
          }
        }

        return 0;
      });
    }

    const settings: SortSettings = {
      sortedData: (order === "ascending") ? array : array.reverse(),
      sortField: field,
      sortOrder: order
    };
    setSorted(settings);
    return settings;
  };

  return {
    sortedData: sorted.sortedData,
    sortField: sorted.sortField,
    sortOrder: sorted.sortOrder,
    sortBy
  };
}
