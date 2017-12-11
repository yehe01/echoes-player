import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CPresetTypes, CSearchTypes, IPlayerSearch } from '../models/player-search';
import { YoutubeSearch } from './youtube.search';
import { YoutubeVideosInfo } from './youtube-videos-info.service';
import { Subscriber } from 'rxjs/Subscriber';

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

  constructor(private youtubeSearch: YoutubeSearch, private youtubeVideosInfo: YoutubeVideosInfo) {
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
    let newPlayerSearch = { ...this.playerSearchSubject.getValue(), query: query, isSearching: true };
    this.playerSearchSubject.next(newPlayerSearch);

    newPlayerSearch = { ...newPlayerSearch, results: [] };
    this.playerSearchSubject.next(newPlayerSearch);

    if (newPlayerSearch.searchType === CSearchTypes.VIDEO) {

      this.youtubeSearch.resetPageToken()
        .searchFor(newPlayerSearch.searchType, newPlayerSearch.query, newPlayerSearch.queryParams)
        .do((youtubeResponse) => {
          const { nextPageToken, prevPageToken } = youtubeResponse;
          const statePageToken = newPlayerSearch.pageToken;
          const pageToken = {
            next: nextPageToken || statePageToken.next,
            prev: prevPageToken || statePageToken.prev
          };

          newPlayerSearch = { ...newPlayerSearch, pageToken };
          this.playerSearchSubject.next(newPlayerSearch);
        })
        .map((medias: { items: GoogleApiYouTubeSearchResource[] }) => medias.items.map(media => media.id.videoId).join(','))
        .mergeMap((mediaIds: string) => this.youtubeVideosInfo.fetchVideosData(mediaIds))
        .subscribe(this.createAddVideosHandler());
      // .catch((err) => Observable.of(this.playerSearchActions.errorInSearch(err)))
    } else {
      this.youtubeSearch.resetPageToken()
        .searchFor(
          newPlayerSearch.searchType,
          newPlayerSearch.query,
          newPlayerSearch.queryParams,
        )
        .do(youtubeResponse => {
          const { nextPageToken, prevPageToken } = youtubeResponse;
          const statePageToken = newPlayerSearch.pageToken;
          const pageToken = {
            next: nextPageToken || statePageToken.next,
            prev: prevPageToken || statePageToken.prev
          };

          this.playerSearchSubject.next({ ...newPlayerSearch, pageToken });
        })
        .map(result => result.items)
        .subscribe(this.createAddVideosHandler());
    }
  }

  resetPageToken() {
    // @Effect()
    //   resetPageToken$ = this.actions$
    //     .ofType(PlayerSearchActions.RESET_PAGE_TOKEN)
    //     .map(toPayload)
    //     .mergeMap(() => Observable.of(this.youtubeSearch.resetPageToken()))
    //     .map(() => ({ type: 'PAGE_RESET_DONE' }));
    this.youtubeSearch.resetPageToken();
  }

  updateQueryAction(query: string) {
    this.playerSearchSubject.next({
      ...this.playerSearchSubject.getValue(), query
    });
  }

  searchMoreForQuery() {
    // @Effect()
    //   searchMoreForQuery$ = this.actions$
    //     .ofType(PlayerSearchActions.SEARCH_MORE_FOR_QUERY)
    //     .map(toPayload)
    //     .withLatestFrom(this.store)
    //     .map((latest: any[]) => latest[1])
    //     .filter((store: EchoesState) => !store.search.isSearching)
    //     .mergeMap((store: EchoesState) => {
    //       this.youtubeSearch.searchMore(store.search.pageToken.next);
    //       return this.youtubeSearch.searchFor(
    //         store.search.searchType,
    //         store.search.query,
    //         store.search.queryParams,
    //       )
    //         .map(youtubeResponse => this.playerSearchActions.searchResultsReturned(youtubeResponse));
    //     });

    const search = this.playerSearchSubject.getValue();
    if (!search.isSearching) {
      this.playerSearchSubject.next({ ...search, isSearching: true });

      // todo: refactor
      if (search.searchType === CSearchTypes.VIDEO) {
        this.youtubeSearch.searchMore(search.pageToken.next)
          .searchFor(
            search.searchType,
            search.query,
            search.queryParams,
          )
          .do(youtubeResponse => {
            const { nextPageToken, prevPageToken } = youtubeResponse;
            const statePageToken = search.pageToken;
            const pageToken = {
              next: nextPageToken || statePageToken.next,
              prev: prevPageToken || statePageToken.prev
            };

            this.playerSearchSubject.next({ ...search, pageToken });
          })
          .map((medias: { items: GoogleApiYouTubeSearchResource[] }) => medias.items.map(media => media.id.videoId).join(','))
          .mergeMap((mediaIds: string) => this.youtubeVideosInfo.fetchVideosData(mediaIds))
          .subscribe(this.createAddVideosHandler());
      } else {
        this.youtubeSearch.searchMore(search.pageToken.next)
          .searchFor(
            search.searchType,
            search.query,
            search.queryParams,
          )
          .do(youtubeResponse => {
            const { nextPageToken, prevPageToken } = youtubeResponse;
            const statePageToken = search.pageToken;
            const pageToken = {
              next: nextPageToken || statePageToken.next,
              prev: prevPageToken || statePageToken.prev
            };

            this.playerSearchSubject.next({ ...search, pageToken });
          })
          .map(result => result.items)
          .subscribe(this.createAddVideosHandler());
      }

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

  private createAddVideosHandler() {
    return Subscriber.create((videos: GoogleApiYouTubeVideoResource[]) => {
      const state = this.playerSearchSubject.getValue();
      const newState = {
        ...this.playerSearchSubject.getValue(),
        results: [...state.results, ...videos],
        isSearching: false
      };

      this.playerSearchSubject.next(newState);
    });
  }
}
