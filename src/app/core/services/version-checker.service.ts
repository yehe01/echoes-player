import { Http } from '@angular/http';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppLayoutService } from './app-layout.service';

@Injectable()
export class VersionCheckerService {
  private interval = 1000 * 60 * 60;
  private protocol = 'https';
  private prefix = 'raw.githubusercontent.com';
  private repo = 'orizens/echoes-player';
  private repoBranch = 'gh-pages';
  private pathToFile = 'assets/package.json';
  public url = `${this.protocol}://${this.prefix}/${this.repo}/${this.repoBranch}/${this.pathToFile}`;

  constructor(private http: Http, private zone: NgZone,
              private appLayoutService: AppLayoutService) {
  }

  check() {
    return this.http.get(this.url);
  }

  start() {
    this.zone.runOutsideAngular(() => {
      Observable.timer(0, this.interval)
        .switchMap(() => this.check())
        .retry()
        .filter(response => response && response.status === 200)
        .subscribe(response => {
          this.appLayoutService.receivedAppVersion(response.json());
        });
    });
  }

  updateVersion() {
    if (window) {
      window.location.reload(true);
    }
  }
}
