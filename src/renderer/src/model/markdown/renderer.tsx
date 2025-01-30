import "./markdown.css";

import { ReactNode } from "react";
import { ASTNode } from "./parser";
import AdvancedRealTimeWidget from "@renderer/components/tradingview/AdvancedRealTimeWidget";
import StyledLink from "@renderer/components/StyledLink/StyledLink";
import { TAGS } from "./tokenizer";
import { TagInfo } from "./token.type";
import QuarterlyEarningsProjector from "@renderer/components/QuarterlyEarningsProjector/QuarterlyEarningsProjector";
import Container from "@renderer/components/Container/Container";
import AnnualEarningsProjector from "@renderer/components/AnnualEarningsProjector/AnnualEarningsProjector";


const INDENT1: ReactNode = <>&emsp;</>;

export function renderAST(astNodes: ASTNode[], keyPrefix: string = ""): ReactNode[] {
  return astNodes.map((astNode: ASTNode, index: number) => {
    let key: string = `${keyPrefix !== "" ? keyPrefix + "-" : ""}${astNode.type}-${index.toString()}`;

    if( astNode.type === "plain-text" || astNode.type === "white-space" ) {
      return astNode.value;
    }

    let culledChildren: ASTNode[] = astNode.children;
    const tagInfo: TagInfo | undefined = TAGS[astNode.type];

    if( tagInfo ) {
      if( tagInfo.allowedTokens ) {
        culledChildren = culledChildren.filter((astNode: ASTNode) => {
          return tagInfo.allowedTokens!.includes(astNode.type);
        });
      } else if( tagInfo.ignoredTokens ) {
        culledChildren = culledChildren.filter((astNode: ASTNode) => {
          return !tagInfo.ignoredTokens!.includes(astNode.type);
        });
      }
    }

    const childNodes: ReactNode[] = renderAST(culledChildren, key);

    const buildListPoint = (pointCharacter: string): ReactNode => {
      return (
        <span key={key}>
          <strong>{pointCharacter}</strong>
          {INDENT1}
          {childNodes}
          <br />
        </span>
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
      case "underline": return <u key={key}>{childNodes}</u>;
      case "header": {
        switch( astNode.value ) {
          case "3": return <h3 key={key}>{childNodes}</h3>;
          case "4": return <h4 key={key}>{childNodes}</h4>;
          case "5": return <h5 key={key}>{childNodes}</h5>;
        }
      } break;
      case "link": {
        return (
          <StyledLink
            key={key}
            href={astNode.value}
          >
            {childNodes}
          </StyledLink>
        );
      }
      case "chart": {
        const split: string[] = culledChildren[0].value?.split(":") || [];

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
      case "col": {
        return (
          <div
            key={key}
            className="d-flex d-direction-column w-100"
          >
            {childNodes}
          </div>
        );
      }
      case "quarterly-projection": {
        const dataNode: ASTNode[] = culledChildren.filter((child: ASTNode) => child.type === "data");

        return (
          <Container key={key}>
            <QuarterlyEarningsProjector
              dataNode={dataNode}
            />
          </Container>
        );
      }
      case "annual-projection": {
          // Resolve the props info from child nodes
        const yearsNode: ASTNode | undefined = 
          culledChildren.find((child: ASTNode) => child.type === "years");
        const startYearNode: ASTNode | undefined = 
          culledChildren.find((child: ASTNode) => child.type === "start-year");
        const marketCapNode: ASTNode | undefined = 
          culledChildren.find((child: ASTNode) => child.type === "market-cap");
        const cashflowNode: ASTNode | undefined = 
          culledChildren.find((child: ASTNode) => child.type === "cashflow");

        return (
          <Container key={key}>
            <AnnualEarningsProjector
              yearsNode={yearsNode}
              startYearNode={startYearNode}
              marketCapNode={marketCapNode}
              cashflowNode={cashflowNode}
            />
          </Container>
        );
      }
    }

    return [];
  });
}
