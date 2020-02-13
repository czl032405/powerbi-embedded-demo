import { Injectable } from '@nestjs/common';
import Axios from 'axios';
import * as qs from 'querystring';
import * as moment from 'moment';

export enum AuthMode {
  SP = 'SP',
  MA = 'MA',
}

@Injectable()
export class PbieService {
  private authMode: AuthMode = AuthMode.SP; // SP MA
  private accessToken: string = null;
  private accessTokenExpiresOn: Date = null;
  private embedTokenMap: { [GroupAndReportId: string]: { token: string; expiresOn: Date } } = {};

  private isAccessTokenExpired() {
    if (!this.accessToken || !this.accessTokenExpiresOn || moment().diff(moment(this.accessTokenExpiresOn)) > 0) {
      return true;
    }
    return false;
  }

  private isEmbedTokenExpired(token: { token: string; expiresOn: Date }) {
    if (!token || !token.token || !token.expiresOn || moment().diff(moment(token.expiresOn)) > 0) {
      return true;
    }
    return false;
  }

  setAuthMode(mode: AuthMode) {
    this.authMode = mode;
  }

  clearTokens() {
    this.accessToken = null;
    this.accessTokenExpiresOn = null;
    this.embedTokenMap = {};
  }

  async getAccessTokenByServicePrinciple(): Promise<string> {
    try {
      console.info('getAccessTokenByServicePrinciple');
      const PBIE_APPLICATION_SECRET = process.env.PBIE_APPLICATION_SECRET;
      const PBIE_APPLICATION_ID = process.env.PBIE_APPLICATION_ID;
      const PBIE_APPLICATION_TENANT = process.env.PBIE_APPLICATION_TENANT;
      const url = `https://login.microsoftonline.com/${PBIE_APPLICATION_TENANT || 'common'}/oauth2/token`;

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      const data = qs.stringify({
        grant_type: 'client_credentials',
        client_id: PBIE_APPLICATION_ID,
        resource: 'https://analysis.windows.net/powerbi/api',
        scope: 'openid',
        client_secret: PBIE_APPLICATION_SECRET,
      });

      const res = await Axios({
        method: 'post',
        url,
        data,
        headers,
      });
      let expires_on = res.data.expires_on;
      let token = res.data.access_token;
      this.accessToken = token;
      this.accessTokenExpiresOn = new Date(+expires_on * 1000);
      return token;
    } catch (error) {
      console.error('getAccessTokenByServicePrinciple error');
      if (error.response) {
        throw error.response.data || error.response.status;
      }
      throw error;
    }
  }

  async getAccessTokenByMasterAccount(): Promise<string> {
    try {
      console.info('getAccessTokenByMasterAccount');

      const username = process.env.PBIE_USERNAME;
      const password = process.env.PBIE_PASSWORD;
      const clientId = process.env.PBIE_APPLICATION_ID;
      const url = 'https://login.microsoftonline.com/common/oauth2/token';

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
      let token = res.data.access_token;
      let expires_on = res.data.expires_on;
      this.accessToken = token;
      this.accessTokenExpiresOn = new Date(+expires_on * 1000);
      return token;
    } catch (error) {
      console.error('getAccessTokenByMasterAccount error');
      if (error.response) {
        throw error.response.data || error.response.status;
      }
      throw error;
    }
  }

  async getAccessToken(): Promise<string> {
    if (!this.isAccessTokenExpired()) {
      return this.accessToken;
    }
    if (this.authMode == 'SP') {
      return await this.getAccessTokenByServicePrinciple();
    }
    if (this.authMode == 'MA') {
      return await this.getAccessTokenByMasterAccount();
    }
  }

  //https://docs.microsoft.com/en-us/rest/api/power-bi/embedtoken/reports_generatetokeningroup
  async getReportEmbedToken(groupId: string, reportId: string): Promise<string> {
    let GroupAndReportId = `${groupId} ${reportId}`;
    let accessToken = await this.getAccessToken();
    if (!this.isEmbedTokenExpired(this.embedTokenMap[GroupAndReportId])) {
      return this.embedTokenMap[GroupAndReportId].token;
    }

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
      let token = res.data.token;
      let expires_on = res.data.expiration;
      this.embedTokenMap[GroupAndReportId] = { token, expiresOn: new Date(expires_on) };
      return token;
    } catch (error) {
      console.error('getReportEmbedToken error');
      if (error.response) {
        throw error.response.data || error.response.status;
      }
      throw error;
    }
  }
}
