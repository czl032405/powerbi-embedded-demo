import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  @Render('index')
  async test() {
    try {
      let groupId = process.env.PBIE_GROUP_SAMPLE_ID;
      let reportId = process.env.PBIE_REPORT_SAMPLE_ID;
      let embedUrl = `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${groupId}`;
      let accessToken = await this.appService.getAccessTokenByMasterAccount();

      let embedToken = await this.appService.getReportEmbedToken(accessToken, groupId, reportId);
      let result = {
        Embed_Token: embedToken,
        Embed_URL: embedUrl,
        Report_ID: reportId,
      };
      console.info(embedUrl);
      return result;
    } catch (error) {
      return error;
    }
  }
}
