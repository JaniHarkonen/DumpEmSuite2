import "./TableList.css";

import { SelectionSet, SelectionItem } from "@renderer/hook/useSelection";
import { ChangeEvent, KeyboardEvent, ReactNode, useContext } from "react";
import EditableText from "../editable/EditableText";
import useTabKeys from "@renderer/hook/useTabKeys";
import { ASSETS } from "@renderer/assets/assets";
import { SortOrder } from "@renderer/hook/useSortedData";
import useTheme from "@renderer/hook/useTheme";
import StyledIcon from "../StyledIcon/StyledIcon";
import { HotkeyListenerReturns, mergeListeners } from "@renderer/hotkey/hotkeyListener";
import useHotkeys from "@renderer/hook/useHotkeys";
import fourDirectionalNavigation from "@renderer/hotkey/fourDirectionalNavigation";
import keyboardActivation from "@renderer/hotkey/keyboardActivation";
import { TabsContext } from "@renderer/context/TabsContext";
import StyledInput from "../StyledInput/StyledInput";


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

export type TableListDataCell<T> = {
  hasHighlight?: boolean;
} & SelectionItem<T>;

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

  const {tabIndex} = useContext(TabsContext);
  const {theme} = useTheme();
  const {formatKey} = useTabKeys();
  const {hotkey} = useHotkeys();

  const renderDataCell = (
    dataCell: TableListDataCell<T>, column: TableListColumn<T>, index: number
  ) => {
    const relativePosition: number = index % pColumns.length;
    const classNameConstructor = () => {
      const isFirstColumn: boolean = (relativePosition === 0);
      const isLastColumn: boolean = ((index + 1) % pColumns.length === 0 && index > 0);
      let className: string = "table-list-data-cell-container pl-medium-length";

      if( dataCell.hasHighlight ) {
        className += " action-bdc";

        if( isFirstColumn ) {
          className += " table-list-first";
        } else if( isLastColumn ) {
          className += " table-list-last";
        } else {
          className += " table-list-highlight";
        }
      }

      if( isLastColumn ) {
        className += " text-align-right pr-medium-length";
      }

      return className;
    };

    let dataElement: ReactNode;

      // Use the element constructor, if one has been provided
    if( column.ElementConstructor ) {
      dataElement = column.ElementConstructor(dataCell, column, index);
    } else {
        // Apply input fields, if editing
      const data = dataCell.data[column.accessor] as string;
      dataElement = (
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
          <div className="table-list-data-cell">
            <StyledInput
              tabIndex={tabIndex()}
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
    }

    const key: string = 
      formatKey("list-table-data-" + (column.accessor as string) + "-" + dataCell.id);

    const hotkeyListener: HotkeyListenerReturns<HTMLDivElement> = mergeListeners(
      fourDirectionalNavigation(
        hotkey, 
        (e: KeyboardEvent<HTMLElement>) => {
          return e.currentTarget.previousElementSibling as HTMLElement;
        },
        (e: KeyboardEvent<HTMLElement>) => {
          return e.currentTarget.nextElementSibling as HTMLElement
        },
        (e: KeyboardEvent<HTMLElement>) => {
          return (
            e.currentTarget.parentElement?.previousElementSibling?.children[index]
          ) as HTMLElement
        },
        (e: KeyboardEvent<HTMLElement>) => {
          return (
            e.currentTarget.parentElement?.nextElementSibling?.children[index]
          ) as HTMLElement;
        },
        { preventDefault: true }
      ), keyboardActivation(hotkey)
    );

    if( index === 0 ) { 
      return (
        <div
          {...theme(classNameConstructor())}
          key={key}
          tabIndex={tabIndex()}
          {...hotkeyListener}
        >
          {dataElement}
        </div>
      );
    }

    return (
      <div
        {...theme(classNameConstructor())}
        key={key}
        tabIndex={tabIndex()}
        {...hotkeyListener}
      >
        {dataElement}
      </div>
    );
  };
  
  return (
    <div
      className="table-list-container box-sizing-border"
      style={{ gridTemplateColumns: "repeat(" + pColumns.length + ", auto)" }}
    >
      {pColumns.map((column: TableListColumn<T>, index: number) => {
        return (
          <div 
            key={formatKey("list-table-header-" + (column.accessor as string))}
            className={
              ((index === pColumns.length - 1) ? "text-align-right" : "") +
              " table-list-column-header-container"
            }
          >
            <span className="mr-medium-length">
              {(column.sortOrder === "ascending") && (
                <StyledIcon src={ASSETS.icons.indicator.arrow.up.black} />
              )} 
              {(column.sortOrder === "descending") && (
                <StyledIcon src={ASSETS.icons.indicator.arrow.down.black} />
              )}
            </span>
            <span
              role="button"
              onClick={() => pOnColumnSelect(column)}
            >
              <strong>{column.caption}</strong>
            </span>
          </div>
        );
      })}
      {pData.map((dataCell: TableListDataCell<T>) => {
        return (
          <div
            key={formatKey("list-table-row-" + dataCell.id)}
            className="table-list-data-row"
            onClick={() => pOnItemFocus(dataCell)}
          >
            {pColumns.map((column: TableListColumn<T>, index: number) => {
              return renderDataCell(dataCell, column, index);
            })}
          </div>
        );
      })}
    </div>
  );
}
