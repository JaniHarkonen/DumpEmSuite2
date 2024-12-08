import { QueryResult } from "src/shared/database.type";


export default function ifQuerySuccessful(
  queryPromise: Promise<QueryResult>, then: () => void
): void {
  queryPromise.then((result: QueryResult) => {
    if( result.wasSuccessful ) {
      then();
    }
  });
}
