import { YoutubePlayerService } from './youtube-player.service';
import { GapiLoader } from './gapi-loader.service';
import { Authorization } from './authorization.service';
import { VersionCheckerService } from './version-checker.service';
import { MediaParserService } from './media-parser.service';
import { AppLayoutService } from './app-layout.service';

export * from './youtube-player.service';
export * from './gapi-loader.service';
export * from './authorization.service';
export * from './version-checker.service';
export * from './media-parser.service';
export * from './app-layout.service';

export const APP_SERVICES = [
  { provide: YoutubePlayerService, useClass: YoutubePlayerService },
  { provide: GapiLoader, useClass: GapiLoader },
  { provide: Authorization, useClass: Authorization },
  { provide: AppLayoutService, useClass: AppLayoutService },
  VersionCheckerService,
  MediaParserService
];
