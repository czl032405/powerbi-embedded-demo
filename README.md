## powerbi-embedded-demo

### Env Preparation

1. Create Power BI Pro Account
2. Create Azure Account, no subscription needed
3. Register App in Azure Active Directory, Grant Api Permissions related to Power BI
4. Prepare ENV in .env file

### Server Auth Steps

1. Get `Access_Token` by Registered App with Master Account or Service Principle
2. Get `Report_ID` and `Group_ID` from the url of Power BI Dashboard
3. Get Power BI Report `Embeded_Token` with Access_Token and Report_ID and Group_ID
4. Get `Embeded_URL` with Report_ID and Group_ID

### Client Rendering

1. Render Reports with `Embeded_Token` `Embeded_URL` `Report_ID` with Power Bi Javascript Library

### TODO

- [ ] Find Official Doc about AAD Auth using HTTP
- [ ] Check how to use Service Principle
- [ ] Token Expires Handle

### Refs

> https://dev.powerbi.com/

> https://app.powerbi.com/embedsetup/AppOwnsData

> https://docs.microsoft.com/en-us/power-bi/developer/embed-service-principal

> https://docs.microsoft.com/en-us/rest/api/power-bi/

> https://github.com/Microsoft/powerbi-javascript/wiki
