type Props = {
  children: string | null | undefined;
};


export default function PageHeader(props: Props) {
  return <h2 className="user-select-text">{props.children}</h2>;
}
