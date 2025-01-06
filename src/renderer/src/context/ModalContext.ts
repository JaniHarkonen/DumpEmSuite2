import { createContext, ReactNode } from "react";


export type ModalContextType = {
  openModal: (modalElement: ReactNode) => void;
  closeModal: () => void;
};

export const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
  closeModal: () => {}
});
