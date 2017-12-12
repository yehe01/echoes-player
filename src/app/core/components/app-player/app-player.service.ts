import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IAppPlayer } from './models/app-player/index';
import { YoutubePlayerService } from '../../services/youtube-player.service';
import { AsyncLocalStorage } from 'angular-async-local-storage';
import { YoutubeApi } from '../../api/youtube-api';

const INIT_STATE: IAppPlayer = {
  mediaId: { videoId: 'NONE' },
  index: 0,
  media: {
    snippet: { title: 'No Media Yet' }
  },
  showPlayer: true,
  playerState: 0,
  fullscreen: {
    on: false,
    height: 270,
    width: 367
  },
  isFullscreen: false
};


@Injectable()
export class AppPlayerService {
  appPlayer: Observable<IAppPlayer>;

  private appPlayerSubject: BehaviorSubject<IAppPlayer>;

  constructor(private youtubePlayerService: YoutubePlayerService,
              private youtubeApi: YoutubeApi,
              private localStorage: AsyncLocalStorage) {
    this.appPlayerSubject = new BehaviorSubject(INIT_STATE);
    this.appPlayer = this.appPlayerSubject.asObservable();

    this.localStorage.getItem('app-player')
      .filter(data => data !== null).subscribe((data) => {
      this.appPlayerSubject.next(data);
    });

    this.appPlayerSubject.filter(l => l !== INIT_STATE)
      .distinctUntilChanged()
      .switchMap(player => {
        return this.localStorage.setItem('app-player', player);
      }).subscribe();

    this.resetFullScreen();
  }

  play(media: GoogleApiYouTubeVideoResource) {
    this.appPlayerSubject.next({
      ...this.appPlayerSubject.getValue(),
      media
    });

    this.youtubePlayerService.playVideo(media);
  }

  togglePlayer() {
    const appPlayer = this.appPlayerSubject.getValue();
    this.appPlayerSubject.next({
      ...appPlayer,
      showPlayer: !appPlayer.showPlayer
    });
  }

  loadAndPlay(media: GoogleApiYouTubeVideoResource) {
    this.youtubeApi.fetchVideoData(media.id)
      .subscribe((video: any) => {
        this.play(video);
      });
  }

  updateState(playerState: YT.PlayerState | any) {
    this.appPlayerSubject.next({
      ...this.appPlayerSubject.getValue(),
      playerState
    });
  }

  fullScreen() {
    const appPlayer = this.appPlayerSubject.getValue();

    const on = !appPlayer.fullscreen.on;
    let { height, width } = INIT_STATE.fullscreen;
    if (on) {
      height = window.innerHeight;
      width = window.innerWidth;
    }
    const fullscreen = { on, height, width };

    const newAppPlayer = {
      ...appPlayer,
      fullscreen
    };

    this.appPlayerSubject.next(newAppPlayer);
    this.youtubePlayerService.setSize(fullscreen.height, fullscreen.width);
  }

  private resetFullScreen() {
    const fullscreen = INIT_STATE.fullscreen;

    this.appPlayerSubject.next({
      ...INIT_STATE,
      ...this.appPlayerSubject.getValue(),
      fullscreen
    });
  }

  reset() {
    this.appPlayerSubject.next({
      ...this.appPlayerSubject.getValue(),
      isFullscreen: false,
      playerState: 0
    });
  }
}
