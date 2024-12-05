type Props = {
  children: string | null | undefined;
};


export default function PageHeader(props: Props) {
  return <h2>{props.children}</h2>;
}