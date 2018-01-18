import { NgModule } from '@angular/core';

import { AppSidebarComponent } from './app-sidebar.component';
import { AppBrandModule } from '../app-brand';
import { AppNavigatorModule } from '../app-navigator';
import { NowPlayingModule } from '../now-playing';
import { SharedModule } from '../../shared';

@NgModule({
  imports: [
    SharedModule,
    AppBrandModule,
    AppNavigatorModule,
    NowPlayingModule
  ],
  exports: [AppSidebarComponent],
  declarations: [AppSidebarComponent],
})
export class AppSidebarModule { }
