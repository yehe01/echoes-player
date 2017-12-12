import { CSearchTypes } from '../../core/models/player-search';
import { Component, OnInit } from '@angular/core';

import { AppService } from '../../core/services/app.service';

import { fadeInAnimation } from '../../shared/animations/fade-in.animation';
import { PlayerSearchService } from '../../core/services/player-search.service';

@Component({
  selector: 'youtube-playlists',
  styles: [
    `
    :host .youtube-items-container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
    }
  `
  ],
  animations: [fadeInAnimation],
  template: `
  <loader [message]="'Loading Awesome Playlists Results'" [loading]="isSearching$ | async"></loader>
  <section class="videos-list">
    <div class="list-unstyled ux-maker youtube-items-container clearfix">
      <youtube-playlist
        [@fadeIn]
        *ngFor="let playlist of results$ | async"
        link=""
        [media]="playlist"
        (play)="playPlaylist(playlist)"
        (queue)="queueSelectedPlaylist(playlist)">
      </youtube-playlist>
    </div>
  </section>
  `
})
export class YoutubePlaylistsComponent implements OnInit {
  results$ = this.playerSearchService.playerSearch$.map(search => search.results);
  isSearching$ = this.playerSearchService.playerSearch$.map(search => search.isSearching);

  constructor(
    private playerSearchService: PlayerSearchService,
    private appPlayerApi: AppService
  ) {}

  ngOnInit() {
    this.playerSearchService.updateSearchType(CSearchTypes.PLAYLIST);

    this.playerSearchService.searchCurrentQuery();
  }

  playPlaylist(media: GoogleApiYouTubePlaylistResource) {
    this.appPlayerApi.playPlaylist(media);
  }

  queueSelectedPlaylist(media: GoogleApiYouTubePlaylistResource) {
    this.appPlayerApi.queuePlaylist(media);
  }
}
