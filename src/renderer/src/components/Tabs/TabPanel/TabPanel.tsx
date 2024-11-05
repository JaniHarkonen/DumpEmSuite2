import { PropsWithChildren, ReactNode } from "react";


type Props = {
  isActive: boolean;
} & PropsWithChildren;

export default function TabPanel(props: Props): ReactNode {
  const pIsActive: boolean = props.isActive;
  const pChildren: ReactNode = props.children;

  return (
    <>
      {pIsActive && (
        <div>
          {pChildren}
        </div>
      )}
    </>
  );
}
