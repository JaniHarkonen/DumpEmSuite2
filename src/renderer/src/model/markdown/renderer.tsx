import { ReactNode } from "react";
import { ASTNode } from "./parser";
import AdvancedRealTimeWidget from "@renderer/components/tradingview/AdvancedRealTimeWidget";


export function renderAST(astNodes: ASTNode[], keyPrefix: string = ""): ReactNode[] {
  return astNodes.map((astNode: ASTNode, index: number) => {
    let key: string = `${keyPrefix}-${astNode.type}-${index.toString()}`;

    if( astNode.type === "plain-text" || astNode.type === "white-space" ) {
      return <span key={`${key}-span`}>{astNode.value}</span>;
    }

    const childNodes: ReactNode[] = renderAST(astNode.children, key);

    switch( astNode.type ) {
      case "new-line": return <br key={key} />;
      case "strong": return <strong key={key}>{childNodes}</strong>;
      case "emphasized": return <em key={key}>{childNodes}</em>;
      case "list-con": return <span key={key}><strong>-</strong>{childNodes}</span>;
      case "list-conclusion": return <span key={key}><strong>⇛</strong>{childNodes}</span>;
      case "list-important": return <span key={key}><strong>!</strong>{childNodes}</span>;
      case "list-info": return <span key={key}><strong>––</strong>{childNodes}</span>;
      case "list-main": return <span key={key}><strong>–</strong>{childNodes}</span>;
      case "list-pro": return <span key={key}><strong>+</strong>{childNodes}</span>;
      case "list-question": return <span key={key}><strong>?</strong>{childNodes}</span>;
      case "underlined": console.log("is");return <u key={key}>{childNodes}</u>;
      case "header": {
        switch( astNode.value ) {
          case "3": return <h3 key={key}>{childNodes}</h3>;
          case "4": return <h4 key={key}>{childNodes}</h4>;
          case "5": return <h5 key={key}>{childNodes}</h5>;
        }
      } break;
      case "link": {
        return (
          <a
            key={key}
            href={astNode.value}
          >
            {childNodes}
          </a>
        );
      }
      case "chart": {
        const split: string[] = astNode.value!.split(":");

        if( split.length !== 2 ) {
          return [];
        }

        return (
          <AdvancedRealTimeWidget
            key={`${key}-${astNode.value}`}
            exchange={split[0]}
            ticker={split[1]}
          />
        );
      }
    }

    return [];
  });
}