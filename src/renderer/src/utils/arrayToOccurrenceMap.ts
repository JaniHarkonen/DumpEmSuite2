type OccurrenceMap = {
  [key in string]: boolean
};

export default function arrayToOccurrenceMap<T>(
  array: T[], assigner: (value: T, index: number, array: T[]) => string
): OccurrenceMap {
  const occurrenceMap: OccurrenceMap = {};
  array.forEach((value: T, index: number, array: T[]) => {
    occurrenceMap[assigner(value, index, array)] = true;
  });
  
  return occurrenceMap;
}
