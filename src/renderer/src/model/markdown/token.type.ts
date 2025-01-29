export type ListPoint = 
  "list-main" | 
  "list-info" | 
  "list-conclusion" | 
  "list-question" | 
  "list-important" | 
  "list-pro" | 
  "list-con"
;

export type TagType = 
  "chart" | 
  "underline" | 
  "row" | 
  "col" | 
  "quarterly-projection" | 
  "data" | 
  "annual-projection" | 
  "id" | 
  "years" | 
  "start-year" 
;

export type TokenType = 
  "strong" | 
  "emphasized" | 
  "paragraph" | 
  "header" | 
  "plain-text" | 
  "new-line" | 
  "tab-character" | 
  "ignore-next" | 
  "white-space" | 
  "link-label-open" |
  "link-label-close" |
  "link-open" |
  "link-close" |
  "link" | 
  "chart-open" |
  "chart-close" |
  "underline" | 
  "underline-open" | 
  "underline-close" |
  "row-open" | 
  "row-close" |
  "col-open" | 
  "col-close" | 
  "quarterly-projection-open" |
  "quarterly-projection-close" |
  "data-open" | 
  "data-close" | 
  "annual-projection-open" | 
  "annual-projection-close" | 
  "id-open" |
  "id-close" |
  "years-open" | 
  "years-close" | 
  "start-year-open" | 
  "start-year-close" |
  ListPoint |
  TagType
;

export type MarkdownToken = {
  type: TokenType;
  value: string;
  isTag?: boolean;
  position?: number;
};

export type TagInfo = {
  opener: MarkdownToken;
  closer: MarkdownToken;
  type: TagType;
  ignoredTokens?: TokenType[];
  allowedTokens?: TokenType[];
};
