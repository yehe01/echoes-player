import { NgModule} from '@angular/core';

import { APP_SERVICES } from './services';
import { APP_RESOLVERS } from './resolvers';
import { APP_APIS } from './api';
import { AppService } from './services/app.service';

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
  providers: [...APP_SERVICES, ...APP_RESOLVERS, ...APP_APIS, AppService]
})
export class CoreModule {
}
