# TODO

### Urgent
- ThemeProvider should be implmented and used to influence the coloring of components
- some HTML components could be wrapped inside a React-component that then applies the current theme to them (e.g. StyledButton)
- SQLite along with a database implementation and relevant contexts are needed before continuing the development of modules as their logic will be heavily dependent on the results returned by the database
- weird reject-handling in promises, look into throwing instead of calling reject

### General
- make sure that all React-hook calls define a type (useState, useRef, useContext, etc.)

### APIs
- APIs should accept JSONs instead of multiple arguments

### TableList derivatives
- CompanyProfilesList and WorkspaceCompaniesList are very similar, see if these could be refactored into a single component

### useFlexibleSplits.ts
- only update the divider settings inside the config file when the divider is released, currently divider saving is disabled but would be saved each time the divider moves

### CompanyList
- the company list may contain stocks quoted at different currencies, consider auto conversion via the free API at https://www.exchangerate-api.com/docs/free (api: https://open.er-api.com/v6/latest/USD) (no api key required); NOTICE: Changes to content security policy are required in order to fetch()

### splits.ts
- get rid of one-value-per-node principle
- don't use interfaces
