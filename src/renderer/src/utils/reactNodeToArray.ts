import { ReactNode } from "react";

/**
 * Ensures that a given value is a ReactNode array. The value will be returned, if it is an array, 
 * and the value will be placed in an array if it's only a ReactNode. If the value is null or
 * undefined, null will be returned.
 * 
 * @param arrayCandidate Candidate value that should be converted into a ReactNode array if it isn't
 * one already.
 * @returns The passed value itself, if it's already a ReactNode array or an array containing the 
 * singular ReactNode that was passed in, or null if null or undefined was given.
 */
export default function reactNodeToArray(arrayCandidate: ReactNode[] | ReactNode | null | undefined) {
  if( !arrayCandidate ) {
    return null;
  }
  return Array.isArray(arrayCandidate) ? arrayCandidate : [arrayCandidate];
}