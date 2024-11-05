import { ReactNode } from "react";
import { DropAreaSettings } from "./DropArea";


export type quadrantDropAreaIDs = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export function quadrantDropAreas(element: ReactNode): DropAreaSettings[] {
  return [
    {
      id: "top-left",
      activation: {
        left: () => 0,
        right: (containerValue: number) => containerValue * 0.5,
        top: () => 0,
        bottom: (containerValue: number) => containerValue * 0.5
      },
      highlight: {
        left: "0px",
        right: "50%",
        top: "0px",
        bottom: "0px",
        element
      }
    },
    {
      id: "top-right",
      activation: {
        left: (containerValue: number) => containerValue * 0.5,
        right: () => 0,
        top: () => 0,
        bottom: (containerValue: number) => containerValue * 0.5
      },
      highlight: {
        left: "0px",
        right: "0px",
        top: "0px",
        bottom: "50%",
        element
      }
    },
    {
      id: "bottom-left",
      activation: {
        left: () => 0,
        right: (containerValue: number) => containerValue * 0.5,
        top: (containerValue: number) => containerValue * 0.5,
        bottom: () => 0
      },
      highlight: {
        left: "0px",
        right: "0px",
        top: "50%",
        bottom: "0px",
        element
      }
    },
    {
      id: "bottom-right",
      activation: {
        left: (containerValue: number) => containerValue * 0.5,
        right: () => 0,
        top: (containerValue: number) => containerValue * 0.5,
        bottom: () => 0
      },
      highlight: {
        left: "50%",
        right: "0px",
        top: "0px",
        bottom: "0px",
        element
      }
    }
  ]
}
