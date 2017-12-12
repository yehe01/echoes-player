import { CSearchTypes } from './models/player-search';
import { Component, OnInit } from '@angular/core';

import { AppService } from '../../core/services/app.service';

import { PlayerSearchService } from './player-search.service';
import { NowPlaylistService } from '../../core/components/now-playing';

@Component({
  selector: 'youtube-videos',
  styleUrls: ['./youtube-videos.scss'],
  template: `
    <loader [message]="'Loading Awesome Media Results'" [loading]="loading$ | async"></loader>
    <youtube-list
      [list]="videos$ | async"
      [queued]="playlistVideos$ | async"
      (play)="playSelectedVideo($event)"
      (queue)="queueSelectedVideo($event)"
      (unqueue)="removeVideoFromPlaylist($event)"
    ></youtube-list>
  `
})
export class YoutubeVideosComponent implements OnInit {
  videos$ = this.playerSearchService.playerSearch$.map(search => search.results);
  loading$ = this.playerSearchService.playerSearch$.map(search => search.isSearching);

  playlistVideos$ = this.nowPlaylistService.playlist$.map(p => p.videos);

  constructor(
    private appPlayerApi: AppService,
    private nowPlaylistService: NowPlaylistService,
    private playerSearchService: PlayerSearchService
  ) {}

  ngOnInit() {
    this.playerSearchService.updateSearchType(CSearchTypes.VIDEO);


    this.playerSearchService.searchCurrentQuery();
  }

  playSelectedVideo(media: GoogleApiYouTubeVideoResource) {
    this.appPlayerApi.playVideo(media);
  }

  queueSelectedVideo(media: GoogleApiYouTubeVideoResource) {
    this.appPlayerApi.queueVideo(media);
  }

  removeVideoFromPlaylist(media: GoogleApiYouTubeVideoResource) {
    this.appPlayerApi.removeVideoFromPlaylist(media);
  }
}
