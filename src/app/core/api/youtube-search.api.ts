import { Injectable } from '@angular/core';
import { YoutubeApi } from './youtube-api';


export const DataApiProviders = {
  SEARCH: 'search',
  PLAYLISTS: 'playlists'
};

const SearchTypes = {
  VIDEO: 'video',
  PLAYLIST: 'playlist',
  CHANNEL: 'channel'
};

export const SearchParams = {
  Types: {
    [SearchTypes.VIDEO]: 'video',
    [SearchTypes.PLAYLIST]: 'playlist',
    [SearchTypes.CHANNEL]: 'channel'
  }
};

@Injectable()
export class YoutubeSearchApi {
  private _apiOptions = {
    part: 'snippet,id',
    q: '',
    type: 'video',
    pageToken: ''
  };

  constructor(private youtubeApiService: YoutubeApi) {
  }

  search(query: string, params?: any) {
    if (query || '' === query) {
      const preset = params ? ` ${params.preset}` : '';
      this._apiOptions.q = `${query}${preset}`;
    }
    return this.youtubeApiService.search(DataApiProviders.SEARCH, this._apiOptions);
  }

  searchFor(type: string, query: string, pageToken = '', params?: any) {
    switch (type) {
      case SearchTypes.VIDEO: {
        return this.searchVideo(query, pageToken, params);
      }

      case SearchTypes.PLAYLIST: {
        return this.searchForPlaylist(query, pageToken, params);
      }
    }
  }

  searchVideo(query: string, pageToken: string, params?: any) {
    this._apiOptions.type = SearchParams.Types[SearchTypes.VIDEO];
    this._apiOptions.pageToken = pageToken;

    return this.search(query, params);
  }

  searchForPlaylist(query: string, pageToken: string, params?: any) {
    this._apiOptions.type = SearchParams.Types[SearchTypes.PLAYLIST];
    this._apiOptions.pageToken = pageToken;

    return this.search(query, params)
      .switchMap((response) => {
        const options = {
          part: 'snippet,id,contentDetails',
          id: response.items.map(pl => pl.id.playlistId).join(',')
        };
        return this.youtubeApiService.search(DataApiProviders.PLAYLISTS, options);
      });
  }
}
