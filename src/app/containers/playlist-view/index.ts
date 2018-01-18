import { NgModule } from '@angular/core';

import { AppNavbarModule } from '../app-navbar';
import { PlaylistViewComponent } from './playlist-view.component';

import { routing } from './playlist-view.routing';
import { PlaylistCoverComponent } from './playlist-cover.component';
import { SharedModule } from '../../shared';

@NgModule({
  imports: [
    AppNavbarModule,
    SharedModule,
    routing
  ],
  declarations: [
    PlaylistViewComponent,
    PlaylistCoverComponent
  ],
  exports: [
    PlaylistViewComponent
  ]
})
export class PlaylistViewModule { }
