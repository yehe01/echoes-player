import { Component, OnInit } from '@angular/core';

import { IPresetParam } from './models/player-search';
import { PlayerSearchService } from './player-search.service';
import { UserProfile } from '../../core/services';

@Component({
  selector: 'app-search',
  styleUrls: ['./app-search.scss'],
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
export class AppSearchComponent {
  query$ = this.playerSearchService.playerSearch$.map(search => search.query);

  currentPlaylist$ = this.userProfile.userProfile$.map(user => user.viewedPlaylist);

  queryParamPreset$ = this.playerSearchService.playerSearch$.map(search => search.queryParams.preset);

  presets$ = this.playerSearchService.playerSearch$.map(search => search.presets);

  constructor(private playerSearchService: PlayerSearchService,
              private userProfile: UserProfile) {
  }

  search(query: string) {
    this.playerSearchService.searchNewQuery(query);
  }

  resetPageToken(query: string) {
    this.playerSearchService.updateQueryAction(query);
  }

  searchMore() {
    this.playerSearchService.searchMoreForQuery();
  }

  updatePreset(preset: IPresetParam) {
    this.playerSearchService.updateQueryParam({ preset: preset.value });
  }
}
