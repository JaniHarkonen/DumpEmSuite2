export type ListPoint = 
  "list-main" | 
  "list-info" | 
  "list-conclusion" | 
  "list-question" | 
  "list-important" | 
  "list-pro" | 
  "list-con"
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
  "chart" | 
  "underline-open" | 
  "underline-close" |
  "underlined" |
  "row-open" | 
  "row-close" |
  "row" |
  "col" | 
  "col-open" | 
  "col-close" | 
  ListPoint;
  