import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { AppNavigatorComponent } from './app-navigator.component';
import { SharedModule } from '../../shared';

@NgModule({
  imports: [
    SharedModule,
    RouterModule
  ],
  declarations: [
    AppNavigatorComponent
  ],
  exports: [
    AppNavigatorComponent
  ],
  providers: []
})
export class AppNavigatorModule { }

// export * from './navigator.component';
