import { Injectable } from '@nestjs/common';
import Axios from 'axios';
import * as qs from 'querystring';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getAccessTokenByMasterAccount() {
    try {
      console.info('getAccessTokenByMasterAccount');
      const url = 'https://login.microsoftonline.com/common/oauth2/token';
      const username = process.env.PBIE_USERNAME;
      const password = process.env.PBIE_PASSWORD;
      const clientId = process.env.PBIE_APPLICATION_ID;

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      const data = qs.stringify({
        grant_type: 'password',
        client_id: clientId,
        resource: 'https://analysis.windows.net/powerbi/api',
        scope: 'openid',
        username: username,
        password: password,
      });

      const res = await Axios({
        method: 'post',
        url,
        data,
        headers,
      });
      let expires_on = res.data.expires_on;

      return res.data.access_token;
    } catch (error) {
      throw error.response.data;
    }
  }

  //https://docs.microsoft.com/en-us/rest/api/power-bi/embedtoken/reports_generatetokeningroup
  async getReportEmbedToken(accessToken, groupId, reportId) {
    try {
      console.info('getReportEmbedToken');

      const url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/reports/${reportId}/GenerateToken`;

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + accessToken,
      };

      const data = {
        accessLevel: 'view',
      };

      const res = await Axios({
        method: 'post',
        url,
        data,
        headers,
      });
      let expires_on = res.data.expiration;
      return res.data.token;
    } catch (error) {
      throw error.response.data;
    }
  }
}
