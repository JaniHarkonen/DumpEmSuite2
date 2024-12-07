import { ReactNode } from "react";

export default function FilterationControls(): ReactNode {

  return(
    <div>
      <button>Fetch all companies</button>
      <button>De-list</button>
      <button>Select all</button>
      <button>De-select all</button>
      <button>Submit</button>
    </div>
  )
}
