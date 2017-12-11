import { Headers, Http, RequestOptionsArgs, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { YOUTUBE_API_KEY } from '../services/constants';
import { Authorization } from '../services/authorization.service';

import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/fromPromise';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

interface YoutubeApiServiceOptions {
  url?: string;
  idKey?: string;
  authService?: Authorization;
  config?: any;
  authorize?: boolean;
}


@Injectable()
export class YoutubeApi {
  private playlistInfoOptions: YoutubeApiServiceOptions = {
    url: 'https://www.googleapis.com/youtube/v3/playlistItems',
    idKey: 'playlistId',
    config: {
      mine: 'true'
    }
  };

  private playlistsOptions: YoutubeApiServiceOptions = {
    url: 'https://www.googleapis.com/youtube/v3/playlists',
    config: {
      mine: 'true',
      part: 'snippet,id,contentDetails'
    },
  };

  private playlistOptions: YoutubeApiServiceOptions = {
    url: 'https://www.googleapis.com/youtube/v3/playlists',
    idKey: 'id',
    config: {
      part: 'snippet,id,contentDetails'
    }
  };

  private videosOptions: YoutubeApiServiceOptions = {
    url: 'https://www.googleapis.com/youtube/v3/videos',
    idKey: 'id',
    config: {
      part: 'snippet,contentDetails,statistics'
    }
  };

  private searchOptions: YoutubeApiServiceOptions = {
    url: 'https://www.googleapis.com/youtube/v3',
    config: {
      part: 'snippet,id',
      maxResults: '50',
      key: YOUTUBE_API_KEY
    }
  };

  constructor(private http: Http,
              private authService?: Authorization) {
  }

  fetchPlaylistItems(playlistId: string, pageToken?) {
    return this.getPlaylistItems(playlistId, pageToken)
      .switchMap(response => {
        const videoIds = response.items.map(video => video.snippet.resourceId.videoId).join(',');
        return this.getVideos(videoIds);
      });
  }

  fetchAllPlaylistItems(playlistId: string) {
    let items = [];
    const subscriptions: Subscription[] = [];
    const items$ = new Subject();
    let nextPageToken = '';
    const fetchMetadata = (response) => {
      const videoIds = response.items.map(video => video.snippet.resourceId.videoId).join(',');
      nextPageToken = response.nextPageToken;
      return this.getVideos(videoIds);
    };
    const collectItems = (videos) => {
      items = [...items, ...videos];
      if (nextPageToken) {
        fetchItems(playlistId, nextPageToken);
      } else {
        items$.next(items);
        subscriptions.forEach(_s => _s.unsubscribe());
        items$.complete();
      }
    };
    const fetchItems = (id, token?) => {
      const sub = this.getPlaylistItems(id, token)
        .switchMap((response) => fetchMetadata(response))
        .subscribe((response) => collectItems(response));
      subscriptions.push(sub);
      return sub;
    };

    fetchItems(playlistId);
    return items$.take(1);
  }

  fetchAllPlaylists() {
    let items = [];
    const subscriptions: Subscription[] = [];
    const items$ = new Subject();
    let nextPageToken = '';

    const fetchMetadata = (response) => {
      nextPageToken = response.nextPageToken;
      return response.items;
    };

    const collectItems = (videos) => {
      items = [...items, ...videos];
      if (nextPageToken) {
        fetchItems(nextPageToken);
      } else {
        items$.next(items);
        subscriptions.forEach(_s => _s.unsubscribe());
        items$.complete();
      }
    };

    const fetchItems = (token?: string) => {
      const sub = this.getPlaylists(token)
        .map((response) => fetchMetadata(response))
        .subscribe((response) => collectItems(response));
      subscriptions.push(sub);
      return sub;
    };

    fetchItems();

    return items$.take(1);
  }

  fetchPlaylist(id) {
    const options = this.playlistOptions;

    const config = this.defaaultConfig();
    let idKey;

    idKey = options.idKey || '';
    if (options.config) {
      this.mergeParams(options.config, config);
    }

    if (idKey) {
      config.set(idKey, id);
    }

    const _options: RequestOptionsArgs = {
      search: config,
      headers: this.createHeaders()
    };

    return this.http.get(options.url, _options)
      .map(response => response.json());
  }

  search(api: string, options) {
    const config = new URLSearchParams();
    if (this.searchOptions.config) {
      this.mergeParams(this.searchOptions.config, config);
    }

    this.mergeParams(options, config);

    const _options: RequestOptionsArgs = {
      search: config,
      headers: this.createHeaders(false)
    };

    const url = `${this.searchOptions.url}/${api}`;
    return this.http.get(url, _options)
      .map(response => response.json());
  }

  private getPlaylistItems(playlistId: string, pageToken?: string) {
    const options = this.playlistInfoOptions;
    const config = this.defaaultConfig();
    let idKey;

    idKey = options.idKey || '';
    if (options.config) {
      this.mergeParams(options.config, config);
    }

    if (idKey) {
      config.set(idKey, playlistId);
    }

    if (pageToken) {
      config.set('pageToken', pageToken);
    } else {
      config.delete('pageToken');
    }

    const _options: RequestOptionsArgs = {
      search: config,
      headers: this.createHeaders()
    };

    return this.http.get(options.url, _options)
      .map(response => response.json());
  }

  fetchVideoData(mediaId: string) {
    return this.getVideos(mediaId)
      .map(items => items[0]);
  }

  fetchVideosData(mediaIds: string) {
    return this.getVideos(mediaIds);
  }

  private getVideos(id) {
    const options = this.videosOptions;

    const config = this.defaaultConfig();
    let idKey;

    idKey = options.idKey || '';
    if (options.config) {
      this.mergeParams(options.config, config);
    }

    const videoId = id.videoId || id;
    config.set(idKey, videoId);

    return this.http.get(options.url, { search: config })
      .map(res => res.json().items);
  }

  private getPlaylists(pageToken?: string) {
    const apiOptions = this.playlistsOptions;

    const config = this.defaaultConfig();

    if (pageToken) {
      config.set('pageToken', pageToken);
    } else {
      config.delete('pageToken');
    }

    let url;

    if (apiOptions) {
      url = apiOptions.url;
      if (apiOptions.config) {
        this.mergeParams(apiOptions.config, config);
      }
    }

    const options: RequestOptionsArgs = {
      search: config,
      headers: this.createHeaders()
    };

    return this.http.get(url, options)
      .map(response => response.json());
  }

  private defaaultConfig() {
    const config = new URLSearchParams();

    config.set('part', 'snippet,contentDetails');
    config.set('key', YOUTUBE_API_KEY);
    config.set('maxResults', '50');
    config.set('pageToken', '');

    return config;
  }

  private mergeParams(source, target: URLSearchParams) {
    Object.keys(source)
      .forEach(param => target.set(param, source[param]));
  }

  private createHeaders(addAuth = true) {
    const accessToken = this.authService && this.authService.accessToken;
    const headersOptions = {};
    if (accessToken && addAuth) {
      headersOptions['authorization'] = `Bearer ${accessToken}`;
    }
    return new Headers(headersOptions);
  }

}
