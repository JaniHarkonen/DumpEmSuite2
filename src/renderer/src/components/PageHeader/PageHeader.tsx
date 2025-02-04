import useTheme from "@renderer/hook/useTheme";


type Header = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type Props = {
  children: string | null | undefined;
  enableTextSelect?: boolean;
  h?: Header;
};

export default function PageHeader(props: Props) {
  const pEnableTextSelect: boolean = props.enableTextSelect ?? true;
  const pH: Header = props.h || "h2"

  const {theme} = useTheme();

  const fixedClass: {
    className: string
  } = theme("glyph-c", pEnableTextSelect ? "user-select-text" : "user-select-none");

  switch( pH ) {
    case "h1": return <h1 {...fixedClass}>{props.children}</h1>;
    case "h2": return <h2 {...fixedClass}>{props.children}</h2>;
    case "h3": return <h3 {...fixedClass}>{props.children}</h3>;
    case "h4": return <h4 {...fixedClass}>{props.children}</h4>;
    case "h5": return <h5 {...fixedClass}>{props.children}</h5>;
    case "h6": return <h6 {...fixedClass}>{props.children}</h6>;
  }
}
