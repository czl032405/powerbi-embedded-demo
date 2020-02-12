## powerbi-embedded-demo

### Env Preparation

1. Create Power BI Pro Account
2. Create Azure Account, no subscription needed
3. Register App in Azure Active Directory, Grant Api Permissions related to Power BI

### Auth Steps

1. Get `Access Token` by Registered App with Master Account or Service Principle
2. Call Power BI Report `Embeded Token` with Access Token

### Rendering

1. Use Power Bi Javascript Library
2. Find Report Id from the url of Power BI Dashboard
3. Render Reports with `Embed_Token` `Embed_URL` `Report_ID`

### TODO

- [] Find Official Doc about AAD Auth using HTTP
- [] Check how to use Service Principle
- [] Token Expires Handle
