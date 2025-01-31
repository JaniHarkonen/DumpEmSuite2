# TODO

### Urgent
- THERE IS A TYPO: `filteration` should be `filtration`
- ThemeProvider should be implmented and used to influence the coloring of components

### React keys
- utilize useTabKeys to generate keys for all workspace views

### Extra info
- don't forget to add "extra infos" written by modules to the app config (though this isn't necessary, it will make the code clearer)

### AnalysesView.tsx
- currently a `span`-element is being used as a button, change this when styles are added

### TableList.tsx
- look into splitting TableList into multiple components that would then be used to construct the tables whenever needed

### General
- make sure that all React-hook calls define a type (useState, useRef, useContext, etc.)

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
