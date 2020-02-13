## powerbi-embedded-demo

### Env Preparation

1. Create Power BI Pro Account.
2. Create Azure Account, no subscription needed
3. Register App in Azure Active Directory, Grant Api Permissions related to Power BI
4. Create Secure Group and add the App in Azure (Service Principle Only)
5. Config Allow Service Principle in app.powerbi.com (Service Principle Only) (Admin Account Required)
6. Add Service Principle as Admin in app.powerbi.com (Service Principle Only)
7. Prepare ENV in .env file

### Server Auth Steps

0. Prepare `Client ID` `TENANT ID` `Client Sercret` in App in Azure AD
1. Get `Access_Token` by Registered App with Master Account or Service Principle
1. Get `Report_ID` and `Group_ID` from the url of Power BI Dashboard
1. Get Power BI Report `Embeded_Token` with Access_Token and Report_ID and Group_ID
1. Get `Embeded_URL` with Report_ID and Group_ID

### Client Rendering

1. Render Reports with `Embeded_Token` `Embeded_URL` `Report_ID` with Power Bi Javascript Library

### TODO

- [ ] Find Official Doc about AAD Auth using HTTP
- [ ] Pass Filter to embedded reports

### Refs

> https://dev.powerbi.com/

> https://app.powerbi.com/embedsetup/AppOwnsData

> https://docs.microsoft.com/en-us/power-bi/developer/embed-service-principal

> https://docs.microsoft.com/en-us/rest/api/power-bi/

> https://github.com/Microsoft/powerbi-javascript/wiki

### 坑

- 文档混乱，代码都写好了，官方文档还没找到
- 需要用 Admin 账号才能看到 powerbi 的 admin portal 配置
- 用自己的 mail2.sysu.edu.cn 注册 azure 和 powerbi 后，其实是作为成员用户使用,无法使用 Admin 功能。
