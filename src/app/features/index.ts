import { AppPlayerModule } from './app-player';
import { AppSidebarModule } from './app-sidebar';
import { AppNavbarModule } from './app-navbar';
import { PlaylistViewModule } from './playlist-view';
import { UserModule } from './user';
import { AppSearchModule } from './app-search';

export const APP_FEATURE_MODULES = [
  AppPlayerModule,
  AppSidebarModule,
  AppSearchModule,
  UserModule,
  AppNavbarModule,
  PlaylistViewModule
];
