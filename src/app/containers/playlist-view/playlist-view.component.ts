import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AppApi } from '../../core/api/app.api';
import { AppService } from '../../core/services/app.service';
import { NowPlaylistService } from '../../features/now-playing';

export interface PlaylistData {
  videos: GoogleApiYouTubeVideoResource[];
  playlist: GoogleApiYouTubePlaylistResource;
}

@Component({
  selector: 'playlist-view',
  styleUrls: ['./playlist-view.component.scss'],
  template: `
    <article>
      <app-navbar [header]="header$ | async"
                  [mainIcon]="'chevron-left'"
                  (headerMainIconClick)="handleBack()">
      </app-navbar>
      <div class="row playlist-content-view">
        <playlist-cover
          [playlist]="playlist$ | async"
          (play)="playPlaylist($event)"
          (queue)="queuePlaylist($event)">
        </playlist-cover>
        <section class="col-md-12">
          <youtube-list
            [list]="videos$ | async"
            [queued]="nowPlaylist$ | async"
            (play)="playVideo($event)"
            (queue)="queueVideo($event)"
            (unqueue)="unqueueVideo($event)"
          ></youtube-list>
        </section>
      </div>
    </article>
  `
})
export class PlaylistViewComponent {
  playlist$ = this.route.data.map((data: PlaylistData) => data.playlist);
  videos$ = this.route.data.map((data: PlaylistData) => data.videos);
  header$ = this.route.data.map((data: PlaylistData) => {
    const playlist = data.playlist;
    const { snippet, contentDetails } = playlist;
    return `${snippet.title} (${contentDetails.itemCount} videos)`;
  });

  nowPlaylist$ = this.nowPlaylistService.playlist$.map(p => p.videos);

  constructor(private route: ActivatedRoute,
              private nowPlaylistService: NowPlaylistService,
              private appPlayerApi: AppService,
              private appApi: AppApi) {
  }

  playPlaylist(playlist: GoogleApiYouTubePlaylistResource) {
    this.appPlayerApi.playPlaylist(playlist);
  }

  queuePlaylist(playlist: GoogleApiYouTubePlaylistResource) {
    this.appPlayerApi.queuePlaylist(playlist);
  }

  queueVideo(media: GoogleApiYouTubeVideoResource) {
    this.appPlayerApi.queueVideo(media);
  }

  playVideo(media: GoogleApiYouTubeVideoResource) {
    this.appPlayerApi.playVideo(media);
  }

  unqueueVideo(media: GoogleApiYouTubeVideoResource) {
    this.appPlayerApi.removeVideoFromPlaylist(media);
  }

  handleBack() {
    this.appApi.navigateBack();
  }
}
