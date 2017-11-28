import { PlayerSearchActions, CSearchTypes } from '../../core/store/player-search';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { EchoesState } from '../../core/store';

// actions
import { NowPlaylistActions } from '../../core/store/now-playlist';
import { ActionTypes } from '../../core/store/app-player';
import { AppPlayerApi } from '../../core/api/app-player.api';

// selectors
import { getPlayerSearchResults$, getNowPlaylist$ } from '../../core/store/reducers';
import { getPlaylistVideos$ } from '../../core/store/now-playlist';
import { getIsSearching$ } from '../../core/store/player-search';
import { PlayerSearchService } from "../../core/services/player-search.service";
import { NowPlaylistService } from '../../core/services/now-playlist.service';
import { ActivatedRoute } from '@angular/router';

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

  // videos$ = this.store.let(getPlayerSearchResults$);
  // loading$ = this.store.let(getIsSearching$);

  videos$ = this.playerSearchService.playerSearch$.map(search => search.results);
  loading$ = this.playerSearchService.playerSearch$.map(search => search.isSearching);

  playlistVideos$ = this.nowPlaylistService.playlist$.map(p => p.videos);

  constructor(
    private appPlayerApi: AppPlayerApi,
    private nowPlaylistService: NowPlaylistService,
    private playerSearchService: PlayerSearchService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // this.store.dispatch(this.playerSearchActions.updateSearchType(CSearchTypes.VIDEO));
    // this.playerSearchService.updateSearchType(CSearchTypes.VIDEO);
    this.route.queryParams.subscribe((p: any) => {
      this.playerSearchService.updateSearchType(p.type || CSearchTypes.VIDEO);
      // this.playerSearchService.updateQueryParam(p.params);
      this.playerSearchService.updateQueryAction(p.query || '');
      console.log(p);

    });

    console.log('12');
    // this.store.dispatch(this.playerSearchActions.searchCurrentQuery());
    // this.playerSearchService.searchCurrentQuery();
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
