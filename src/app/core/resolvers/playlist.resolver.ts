import { Observable } from 'rxjs/Observable';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { YoutubeApi } from '../api/youtube-api';

@Injectable()
export class PlaylistResolver implements Resolve<any> {
  constructor(private youtubeApiService: YoutubeApi) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<GoogleApiYouTubePlaylistResource> {
    const playlistId = route.params['id'];
    return this.youtubeApiService.fetchPlaylist(playlistId)
      .map(response => response.items[0]);
  }
}
