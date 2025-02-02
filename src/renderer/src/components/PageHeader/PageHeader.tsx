import useTheme from "@renderer/hook/useTheme";

type Props = {
  children: string | null | undefined;
};


export default function PageHeader(props: Props) {
  const {theme} = useTheme();

  return (
    <h2 {...theme("glyph-c", "user-select-text")}>
      {props.children}
    </h2>
  );
}
