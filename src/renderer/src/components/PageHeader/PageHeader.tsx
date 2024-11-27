type Props = {
  children: string;
};


export default function PageHeader(props: Props) {
  return <h2>{props.children}</h2>;
}