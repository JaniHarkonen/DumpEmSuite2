type TabbedViewProps = {
  height: number;
  children?: React.ReactNode;
};

export default function TabbedView(props: TabbedViewProps): JSX.Element {
  const pHeight: number = props.height;
  const pChildren: React.ReactNode = props.children || <></>;

  return (
    <>
      <div style={{width: "100%", height: pHeight, backgroundColor: "red"}}></div>
      {pChildren}
    </>
  );
}
