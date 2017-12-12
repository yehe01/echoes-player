import { UserProfile } from './user-profile.service';
import { YoutubeSearchApi } from '../api/youtube-search.api';
import { YoutubePlayerService } from './youtube-player.service';
import { NowPlaylistService } from './now-playlist.service';
import { GapiLoader } from './gapi-loader.service';
import { Authorization } from './authorization.service';
import { VersionCheckerService } from './version-checker.service';
import { MediaParserService } from './media-parser.service';
import { PlayerSearchService } from './player-search.service';
import { AppPlayerService } from './app-player.service';
import { AppLayoutService } from './app-layout.service';
import { AppApi } from '../api/app.api';

export * from './user-profile.service';
export * from '../api/youtube-search.api';
export * from './youtube-player.service';
export * from './now-playlist.service';
export * from './gapi-loader.service';
export * from './authorization.service';
export * from './version-checker.service';
export * from './media-parser.service';

export const APP_SERVICES = [
  { provide: UserProfile, useClass: UserProfile },
  { provide: YoutubePlayerService, useClass: YoutubePlayerService },
  { provide: NowPlaylistService, useClass: NowPlaylistService },
  { provide: GapiLoader, useClass: GapiLoader },
  { provide: Authorization, useClass: Authorization },
  { provide: AppLayoutService, useClass: AppLayoutService },
  { provide: PlayerSearchService, useClass: PlayerSearchService },
  { provide: AppPlayerService, useClass: AppPlayerService },
  AppApi,
  VersionCheckerService,
  MediaParserService
];
