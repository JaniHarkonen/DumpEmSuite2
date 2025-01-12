# TODO

### Urgent
- THERE IS A TYPO: `filteration` should be `filtration`
- filteration steps should specify the step that their verdicts will be submitted to (currently this info is derived from the tabIndex which doesn't make any sense because the tabs may be scattered into different views, thus the next tab may not be the tab that the user wants to submit the filtration result to)
- ThemeProvider should be implmented and used to influence the coloring of components

### AnalysesView.tsx
- currently a `span`-element is being used as a button, change this when styles are added

### TableList.tsx
- this component is becoming perhaps too general, also `table` is most likely not the best element for displaying data that may require checkboxes and `select`-elements
- switch out of using `table`, use flexbox instead
- look into splitting TableList into multiple components that would then be used to construct the tables whenever needed

### General
- make sure that all React-hook calls define a type (useState, useRef, useContext, etc.)
- some HTML components could be wrapped inside a React-component that then applies the current theme to them (e.g. StyledButton)

### APIs
- APIs should accept JSONs instead of multiple arguments

### databaseAPI.ts
- DatabaseManager instance should be provided to the API at app start, rather than be created in the API ts-file
- split function declarations into separate files

### useFlexibleSplits.ts
- only update the divider settings inside the config file when the divider is released, currently divider saving is disabled but would be saved each time the divider moves

### CompanyList
- the company list may contain stocks quoted at different currencies, consider auto conversion via the free API at https://www.exchangerate-api.com/docs/free (api: https://open.er-api.com/v6/latest/USD) (no api key required); NOTICE: Changes to content security policy are required in order to fetch()

### splits.ts
- get rid of one-value-per-node principle
