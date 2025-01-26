import "./markdown.css";

import { ReactNode } from "react";
import { ASTNode } from "./parser";
import AdvancedRealTimeWidget from "@renderer/components/tradingview/AdvancedRealTimeWidget";


const INDENT1: ReactNode = <>&emsp;</>;

export function renderAST(astNodes: ASTNode[], keyPrefix: string = ""): ReactNode[] {
  return astNodes.map((astNode: ASTNode, index: number) => {
    let key: string = `${keyPrefix !== "" ? keyPrefix + "-" : ""}${astNode.type}-${index.toString()}`;

    if( astNode.type === "plain-text" || astNode.type === "white-space" ) {
      return astNode.value;
    }

    const childNodes: ReactNode[] = renderAST(astNode.children, key);

    const buildListPoint = (pointCharacter: string): ReactNode => {
      return (
        <span key={key}><strong>{pointCharacter}</strong>{INDENT1}{childNodes}</span>
      );
    };

    switch( astNode.type ) {
      case "new-line": return <br key={key} />;
      case "tab-character": return <span key={key}>{INDENT1}</span>;
      case "strong": return <strong key={key}>{childNodes}</strong>;
      case "emphasized": return <em key={key}>{childNodes}</em>;
      case "list-con": return buildListPoint("-");
      case "list-conclusion": return buildListPoint("⇛");
      case "list-important": return buildListPoint("!");
      case "list-info": return buildListPoint("––");
      case "list-main": return buildListPoint("–");
      case "list-pro": return buildListPoint("+");
      case "list-question": return buildListPoint("?");
      case "underlined": return <u key={key}>{childNodes}</u>;
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
          <div
            key={`${key}-${astNode.value}`}
            className="aspect-ratio-16-9 w-100"
          >
            <AdvancedRealTimeWidget
              exchange={split[0]}
              ticker={split[1]}
            />
          </div>
        );
      }
      case "row": {
        return (
          <div
            key={key}
            className="markdown-row"
          >
            <div className="markdown-row-content-container">
              {childNodes}
            </div>
          </div>
        );
      }
    }

    return [];
  });
}
