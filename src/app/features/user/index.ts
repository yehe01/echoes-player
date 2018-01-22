import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared';
import { AppNavbarModule } from '../app-navbar';

import { UserComponent } from './user.component';
import { PlaylistsComponent } from './playlists';
// import { PlaylistViewComponent, PlaylistResolver, PlaylistVideosResolver } from '../../shared/components/playlist-view';

import { AuthGuard } from './user.guard';
import { routing } from './user.routing';
import { UserProfile } from './user-profile.service';

@NgModule({
  imports: [
    SharedModule,
    AppNavbarModule,
    routing
  ],
  declarations: [
    UserComponent,
    PlaylistsComponent
  ],
  exports: [
    UserComponent
  ],
  providers: [
    AuthGuard,
    UserProfile
  ]
})
export class UserModule { }
