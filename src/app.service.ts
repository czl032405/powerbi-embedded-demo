import { Injectable } from '@nestjs/common';
import Axios from 'axios';
import * as qs from 'querystring';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
