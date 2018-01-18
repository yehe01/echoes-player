import { Observable } from 'rxjs/Observable';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { YoutubeApi } from '../api/youtube-api';

@Injectable()
export class PlaylistVideosResolver implements Resolve<any> {
  constructor(private youtubeApiService: YoutubeApi) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const playlistId = route.params['id'];
    return this.youtubeApiService.fetchAllPlaylistItems(playlistId);
  }
}
