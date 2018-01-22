import { VersionCheckerService } from './core/services';
import { Component, HostBinding, OnInit } from '@angular/core';

import { AppLayoutService } from './core/services';

@Component({
  selector: 'body',
  styleUrls: ['./app.component.scss'],
  template: `
    <app-player class="navbar navbar-default navbar-fixed-bottom"></app-player>

    <app-sidebar [class.closed]="sidebarCollapsed$ | async"></app-sidebar>

    <div class="container-main">
      <router-outlet></router-outlet>
    </div>`
})
export class AppComponent implements OnInit {
  sidebarCollapsed$ = this.appLayoutService.appLayout$.map(layout => layout.sidebarExpanded);
  theme$ = this.appLayoutService.appLayout$.map(layout => layout.theme);

  @HostBinding('class')
  style = 'arctic';

  constructor(private versionCheckerService: VersionCheckerService,
              private appLayoutService: AppLayoutService) {
    versionCheckerService.start();
  }

  ngOnInit() {
    this.theme$.subscribe(theme => this.style = theme);
  }
}
