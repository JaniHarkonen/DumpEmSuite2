function compound(...components: string[]): string {
  if( components.length === 0 ) {
    return "";
  }

  let compoundString: string = components[0];
  for( let i = 1; i < components.length; i++ ) {
    compoundString += ", " + components[i];
  }

  return compoundString;
}

export function query(queryString: string): string {
  return queryString + ";";
}

export function subquery(queryString: string): string {
  return " (" + queryString + ")";
}

export function col<T>(columnString: keyof T, tableAlias?: string): string {
  return (tableAlias ? tableAlias + "." : "") + (columnString as string);
}

export function table(tableString: string, tableAlias?: string): string {
  return tableString + (tableAlias ? " " + tableAlias : "");
}

export function SELECT(...column: string[]): string {
  return "SELECT " + compound(...column);
}

export function FROM(...table: string[]): string {
  return " FROM " + compound(...table);
}

export function WHERE(whereString: string): string {
  return " WHERE " + whereString;
}

export function DELETE(deleteString: string): string {
  return "DELETE " + deleteString;
}

export function IN(columnString: string, ...valueString: string[]): string {
  return " " + columnString + " IN (" + compound(...valueString) + ")";
}

export function equals(columnStringA: string, columnStringB: string): string {
  return columnStringA + "=" + columnStringB;
}

export function AND(conditionStringA: string, conditionStringB: string): string {
  return " " + conditionStringA + " AND " + conditionStringB;
}

export function UPDATE(tableString: string):string {
  return "UPDATE " + tableString;
}

export function SET(...setterString: string[]): string {
  return " SET " + compound(...setterString);
}

export function insertInto(
  tableString: string, ...columnString: string[]
): string {
  return "INSERT INTO " + tableString + "(" + compound(...columnString) + ")";
}

export function value(...valueString: string[]): string {
  return "(" + compound(...valueString) + ")";
}

export function values(...value: string[]): string {
  return (
    " VALUES " + compound(...value)
  );
}

export function val(valueString?: string): string {
  return valueString ? valueString : "?";
}
