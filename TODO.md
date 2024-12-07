# TODO

### Urgent
- ThemeProvider should be implmented and used to influence the coloring of components

### AnalysesView.tsx
- currently a `span`-element is being used as a button, change this when styles are added

### General
- make sure that all React-hook calls define a type (useState, useRef, useContext, etc.)
- some HTML components could be wrapped inside a React-component that then applies the current theme to them (e.g. StyledButton)

### APIs
- APIs should accept JSONs instead of multiple arguments

### databaseAPI.ts
- DatabaseManager instance should be provided to the API at app start, rather than be created in the API ts-file

### useFlexibleSplits.ts
- only update the divider settings inside the config file when the divider is released, currently divider saving is disabled but would be saved each time the divider moves

### CompanyList
- the company list may contain stocks quoted at different currencies, consider auto conversion via the free API at https://www.exchangerate-api.com/docs/free (api: https://open.er-api.com/v6/latest/USD) (no api key required); NOTICE: Changes to content security policy are required in order to fetch()

### splits.ts
- get rid of one-value-per-node principle
