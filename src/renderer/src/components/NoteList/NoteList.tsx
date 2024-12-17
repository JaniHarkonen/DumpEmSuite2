import "./NoteList.css";
import { ReactNode } from "react";

type Props = {
  children: string;
}

export default function NoteList(): ReactNode {
  return (
    <>
      <span className="d-flex">
        <span className="note-list-item-bullet mr-strong"><b>–</b></span>
        <span>test</span>
      </span>
      <span className="d-flex">
        <span className="note-list-item-bullet mr-strong"><b>⇛</b></span>
        <span>test</span>
      </span>
      <span className="d-flex">
        <span className="note-list-item-bullet mr-strong"><b>?</b></span>
        <span>test</span>
      </span>
      <span className="d-flex">
        &emsp;
        <span className="note-list-item-bullet mr-strong"><b>+</b></span>
        <span>test</span>
      </span>
      <span className="d-flex">
        &emsp;
        <span className="note-list-item-bullet mr-strong"><b>-</b></span>
        <span>test</span>
      </span>
      <span className="d-flex">
        &emsp;
        <span className="note-list-item-bullet mr-strong"><b>––</b></span>
        <span>test</span>
      </span>
      <span className="d-flex">
        &emsp;
        <span className="note-list-item-bullet mr-strong"><b>!</b></span>
        <span>test</span>
      </span>
    </>
  );
}
