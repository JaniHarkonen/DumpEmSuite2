import useTheme from "@renderer/hook/useTheme";


type Props = {
  children: string | null | undefined;
  enableTextSelect?: boolean;
};

export default function PageHeader(props: Props) {
  const pEnableTextSelect: boolean = props.enableTextSelect ?? true;
  const {theme} = useTheme();

  return (
    <h2 {...theme("glyph-c", pEnableTextSelect ? "user-select-text" : "user-select-none")}>
      {props.children}
    </h2>
  );
}
