import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { CoreModule } from './core';
import { SharedModule } from './shared';

import { ROUTES } from './app.routes';

import { AppComponent } from './app.component';
import { AsyncLocalStorageModule } from 'angular-async-local-storage';
import { APP_FEATURE_MODULES } from './features';
import './rxjs-operators';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AsyncLocalStorageModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    RouterModule.forRoot(ROUTES, { useHash: true }),
    BrowserAnimationsModule,

    CoreModule,
    SharedModule,
    ...APP_FEATURE_MODULES,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
