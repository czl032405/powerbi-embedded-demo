import { Controller, Get, Render, Req, Query } from '@nestjs/common';
import { PbieService, AuthMode } from './pbie.service';

@Controller()
export class AppController {
  constructor(private readonly pbieService: PbieService) {}

  @Get()
  @Render('index')
  async index(@Query('mode') mode: string) {
    try {
      mode = mode || 'MA';
      switch (mode) {
        case AuthMode.MA:
          return await this.tokenByMasterAccount();
        case AuthMode.SP:
          return await this.tokenByServicePrinciple();
      }
    } catch (error) {
      return error;
    }
  }

  @Get('tokenByMA')
  async tokenByMasterAccount() {
    this.pbieService.clearTokens();
    this.pbieService.setAuthMode(AuthMode.MA);
    let groupId = process.env.PBIE_GROUP_SAMPLE_ID;
    let reportId = process.env.PBIE_REPORT_SAMPLE_ID;
    let Embed_URL = `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${groupId}`;
    let Embed_Token = await this.pbieService.getReportEmbedToken(groupId, reportId);
    let result = {
      Embed_Token,
      Embed_URL,
      Report_ID: reportId,
    };
    console.info(Embed_URL);
    return result;
  }

  @Get('tokenBySP')
  async tokenByServicePrinciple() {
    this.pbieService.clearTokens();
    this.pbieService.setAuthMode(AuthMode.SP);
    let groupId = process.env.PBIE_GROUP_SAMPLE_ID;
    let reportId = process.env.PBIE_REPORT_SAMPLE_ID;
    let Embed_URL = `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${groupId}`;
    let Embed_Token = await this.pbieService.getReportEmbedToken(groupId, reportId);
    let result = {
      Embed_Token,
      Embed_URL,
      Report_ID: reportId,
    };
    console.info(Embed_URL);
    return result;
  }
}
