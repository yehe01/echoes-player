import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';

import { NowPlayingComponent } from './now-playing.component';
import { NowPlaylistComponent, NowPlaylistTrackComponent } from './now-playlist';
import { NowPlaylistFilterComponent } from './now-playlist-filter';
import { NowPlaylistService } from './now-playlist.service';
export * from './now-playlist.service';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    NowPlayingComponent,
    NowPlaylistComponent,
    NowPlaylistTrackComponent,
    NowPlaylistFilterComponent
  ],
  exports: [
    NowPlayingComponent
  ],
  providers: [NowPlaylistService]
})
export class NowPlayingModule { }
