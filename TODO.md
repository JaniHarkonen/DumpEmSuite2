# TODO

### Urgent
- THERE IS A TYPO: `filteration` should be `filtration`

### Extra info
- don't forget to add "extra infos" written by modules to the app config (though this isn't necessary, it will make the code clearer)

### databaseAPI.ts
- DatabaseManager instance should be provided to the API at app start, rather than be created in the API ts-file

### CompanyList
- the company list may contain stocks quoted at different currencies, consider auto conversion via the free API at https://www.exchangerate-api.com/docs/free (api: https://open.er-api.com/v6/latest/USD) (no api key required); NOTICE: Changes to content security policy are required in order to fetch()
