import "./NewWorkspaceModal.css";

import { ReactNode } from "react";


export default function NewWorkspaceModal(): ReactNode {
  const createNewWorkspace = () => {

  };

  return (
    <div className="modal-window-container">
      <div className="modal-content-container">
        <div className="modal-content-topbar">
          <strong>Create new workspace</strong>
          <button>X</button>
        </div>
        <div className="d-flex d-justify-center">
          <div>
            <label htmlFor="new-workspace-modal-workspace-name">
              Name: 
            </label>
            <input
              id="new-workspace-modal-workspace-name"
              type="text"
              autoFocus={true}
            />
            <button onClick={createNewWorkspace}>Create</button>
          </div>
        </div>
      </div>
    </div>
  );
}
