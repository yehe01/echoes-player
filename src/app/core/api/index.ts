import { AppService } from '../services/app.service';
import { YoutubeApi } from './youtube-api';
import { YoutubeSearchApi } from './youtube-search.api';

export const APP_APIS = [
  AppService,
  YoutubeApi,
  YoutubeSearchApi
];

