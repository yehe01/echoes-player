import { NgModule } from '@angular/core';

import { AppPlayerComponent } from './app-player.component';
import { MediaInfoComponent } from './media-info';
import { PlayerControlsComponent } from './player-controls/player-controls.component';
import { PlayerResizerComponent } from './player-resizer/player-resizer.component';
import { ImageBlurComponent } from './image-blur';
import { AppPlayerService } from './app-player.service';
import { SharedModule } from '../../shared';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    AppPlayerComponent,
    MediaInfoComponent,
    PlayerControlsComponent,
    PlayerResizerComponent,
    ImageBlurComponent
  ],
  exports: [
    AppPlayerComponent
  ],
  providers: [AppPlayerService]
})
export class AppPlayerModule { }
