# TODO

### Urgent
- ThemeProvider should be implmented and used to influence the coloring of components
- some HTML components could be wrapped inside a React-component that then applies the current theme to them (e.g. StyledButton)
- SQLite along with a database implementation and relevant contexts are needed before continuing the development of modules as their logic will be heavily dependent on the results returned by the database

### useFlexibleSplits.ts
- only update the divider settings inside the config file when the divider is released, currently divider saving is disabled but would be saved each time the divider moves

### splits.ts
- get rid of one-value-per-node principle
- don't use interfaces
