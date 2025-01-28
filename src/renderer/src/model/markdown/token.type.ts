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
  "annual-projection" | 
  "id" | 
  "years"
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
  "annual-projection-open" | 
  "annual-projection-close" | 
  "id-open" |
  "id-close" |
  "years-open" | 
  "years-close" | 
  ListPoint |
  TagType
;

export type MarkdownToken = {
  type: TokenType;
  value: string;
  isTag?: boolean;
};

export type TagInfo = {
  opener: MarkdownToken;
  closer: MarkdownToken;
  type: TagType;
  ignoredTokens?: TokenType[];
  allowedTokens?: TokenType[];
};
