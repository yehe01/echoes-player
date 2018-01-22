import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CPresetTypes, CSearchTypes, IPlayerSearch } from './models/player-search';
import { YoutubeSearchApi } from '../../core/api/youtube-search.api';
import { Subscriber } from 'rxjs/Subscriber';
import { YoutubeApi } from '../../core/api/youtube-api';

const INIT_STATE: IPlayerSearch = {
  query: '',
  filter: '',
  searchType: CSearchTypes.VIDEO,
  queryParams: {
    preset: '',
    duration: -1
  },
  presets: [
    { label: 'Any', value: '' },
    { label: 'Albums', value: CPresetTypes.FULL_ALBUMS },
    { label: 'Live', value: CPresetTypes.LIVE }
  ],
  pageToken: {
    next: '',
    prev: ''
  },
  isSearching: false,
  results: []
};


@Injectable()
export class PlayerSearchService {
  playerSearch$: Observable<IPlayerSearch>;

  private playerSearchSubject: BehaviorSubject<IPlayerSearch>;

  constructor(private youtubeSearch: YoutubeSearchApi, private youtubeApi: YoutubeApi) {
    this.playerSearchSubject = new BehaviorSubject(INIT_STATE);
    this.playerSearch$ = this.playerSearchSubject.asObservable();
  }

  updateSearchType(searchType: string) {
    this.playerSearchSubject.next({
      ...this.playerSearchSubject.getValue(),
      searchType: searchType
    });
  }

  searchCurrentQuery() {
    this.searchNewQuery(this.playerSearchSubject.getValue().query);
  }

  searchNewQuery(query: string) {
    const search = {
      ...this.playerSearchSubject.getValue(), query: query,
      isSearching: true,
      results: []
    };

    this.playerSearchSubject.next(search);

    this.searchQuery(search, '');
  }

  searchMoreForQuery() {
    const search = this.playerSearchSubject.getValue();
    if (!search.isSearching) {
      this.searchQuery(search, search.pageToken.next);
    }
  }

  updateQueryParam(param) {
    const search = this.playerSearchSubject.getValue();
    const queryParams = { ...search.queryParams, ...param };

    const newSearch = {
      ...search,
      queryParams,
      results: []
    };

    this.playerSearchSubject.next(newSearch);
    this.searchCurrentQuery();
  }

  private searchQuery(search: IPlayerSearch, pageToken: string) {
    this.playerSearchSubject.next({ ...search, isSearching: true });

    if (search.searchType === CSearchTypes.VIDEO) {
      this.youtubeSearch.searchFor(search.searchType, search.query, pageToken, search.queryParams)
        .do(v => this.updatePageToken(v))
        .map((medias: { items: GoogleApiYouTubeSearchResource[] }) =>
          medias.items.map(media => media.id.videoId).join(','))
        .mergeMap((mediaIds: string) => this.youtubeApi.fetchVideosData(mediaIds))
        .subscribe(this.createAddVideosHandler());
    } else {
      this.youtubeSearch.searchFor(search.searchType, search.query, pageToken, search.queryParams)
        .do(v => this.updatePageToken(v))
        .map(result => result.items)
        .subscribe(this.createAddVideosHandler());
    }
  }

  private createAddVideosHandler() {
    return Subscriber.create((videos: GoogleApiYouTubeVideoResource[]) => {
      const state = this.playerSearchSubject.getValue();
      const newState = {
        ...this.playerSearchSubject.getValue(),
        results: [...state.results, ...videos],
        isSearching: false
      };

      this.playerSearchSubject.next(newState);
    }, e => {
      const search = {
        ...this.playerSearchSubject.getValue(),
        results: [],
        isSearching: false
      };

      this.playerSearchSubject.next(search);
    });
  }

  private updatePageToken(youtubeResponse) {
    const search = this.playerSearchSubject.getValue();
    const { nextPageToken, prevPageToken } = youtubeResponse;
    const statePageToken = search.pageToken;
    const newPageToken = {
      next: nextPageToken || statePageToken.next,
      prev: prevPageToken || statePageToken.prev
    };

    this.playerSearchSubject.next({ ...search, newPageToken });
  }
}
