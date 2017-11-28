import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { EchoesState } from '../../core/store';

import { IPresetParam} from '../../core/store/player-search';
import { getUserViewPlaylist$ } from '../../core/store/user-profile';
import { getQueryParamPreset$, getPresets$ } from '../../core/store/player-search';
import { PlayerSearchService } from '../../core/services/player-search.service';
import { UserProfile } from '../../core/services/user-profile.service';
import { Router } from '@angular/router';
import { IPlayerSearch, ISearchQueryParam } from '../../core/store/player-search/player-search.interfaces';

@Component({
  selector: 'app-search',
  styleUrls: [ './app-search.scss' ],
  template: `
  <article
    infiniteScroll
    [infiniteScrollDistance]="2"
    [infiniteScrollDisabled]="currentPlaylist$ | async"
    (scrolled)="searchMore()"
    [immediateCheck]="true">
    <app-navbar>
      <div class="navbar-header">
        <player-search
          [query]="query$ | async"
          (queryChange)="resetPageToken($event)"
          (search)="search($event)"
        ></player-search>
      </div>
      <button-group class="nav-toolbar"
        [buttons]="presets$ | async"
        [selectedButton]="queryParamPreset$ | async"
        (buttonClick)="updatePreset($event)"
      ></button-group>
      <search-navigator></search-navigator>
    </app-navbar>
    <router-outlet></router-outlet>
    </article>
    `
})
export class AppSearchComponent implements OnInit {
  // query$ = this.store.let(getQuery$);
  query$ = this.playerSearchService.playerSearch$.map(search => search.query);

  // currentPlaylist$ = this.store.let(getUserViewPlaylist$);
  currentPlaylist$ = this.userService.userProfile$.map(user => user.playlists);

  // queryParamPreset$ = this.store.let(getQueryParamPreset$);
  queryParamPreset$ = this.playerSearchService.playerSearch$.map(search => search.queryParams.preset);

  // presets$ = this.store.let(getPresets$);
  presets$ = this.playerSearchService.playerSearch$.map(search => search.presets);

  constructor(
    private store: Store<EchoesState>,
    private playerSearchService: PlayerSearchService,
    private userService: UserProfile,
    private router: Router
  ) { }

  ngOnInit() {}

  search (query: string) {
    // this.store.dispatch(this.playerSearchActions.searchNewQuery(query));
    // this.playerSearchService.searchNewQuery(query);
    this.playerSearchService.updateQueryAction(query);
    const sub = this.playerSearchService.playerSearch$.subscribe(search =>
      this.router.navigate(['search/videos', search]));
    sub.unsubscribe();
  }

  resetPageToken(query: string) {
    // this.store.dispatch(this.playerSearchActions.resetPageToken());
    this.playerSearchService.resetPageToken();

    // this.store.dispatch(new UpdateQueryAction(query));
    this.playerSearchService.updateQueryAction(query);
  }

  searchMore () {
    // this.store.dispatch(this.playerSearchActions.searchMoreForQuery());
    this.playerSearchService.searchMoreForQuery();
  }

  updatePreset(preset: IPresetParam) {
    // this.store.dispatch(this.playerSearchActions.updateQueryParam({ preset: preset.value }));
    this.playerSearchService.updateQueryParam({ preset: preset.value });

  }
}
