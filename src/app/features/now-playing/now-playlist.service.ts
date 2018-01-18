import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as NowPlaylist from './models/index';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { INowPlaylist } from './models/index';
import { AsyncLocalStorage } from 'angular-async-local-storage';
import { MediaParserService, YoutubePlayerService } from '../../core/services';
import { YoutubeApi } from '../../core/api/youtube-api';

const INIT_STATE: INowPlaylist = {
  videos: [],
  selectedId: '',
  filter: '',
  repeat: false
};

@Injectable()
export class NowPlaylistService {
  public playlist$: Observable<INowPlaylist>;

  private playlistSubject: BehaviorSubject<INowPlaylist>;


  constructor(private youtubeApi: YoutubeApi,
              private mediaParser: MediaParserService,
              private playerService: YoutubePlayerService,
              private localStorage: AsyncLocalStorage) {

    this.playlistSubject = new BehaviorSubject(INIT_STATE);
    this.playlist$ = this.playlistSubject.asObservable();

    this.localStorage.getItem('now-playlist')
      .filter(data => data !== null).subscribe((data) => {
      this.playlistSubject.next(data);
    });

    this.playlistSubject.filter(p => p !== INIT_STATE)
      .distinctUntilChanged()
      .switchMap(playlist => {
      return this.localStorage.setItem('now-playlist', playlist);
    }).subscribe();
  }

  static addMedia(videos: GoogleApiYouTubeVideoResource[], media: any) {
    const newMedia = [...videos].findIndex(video => video.id === media.id);
    const newMedias = [];
    if (newMedia === -1) {
      newMedias.push(media);
    }
    return [...videos, ...newMedias];
  }

  static addMedias(videos, medias) {
    const allVideoIds = videos.map(video => video.id);
    const newVideos = [];
    medias.forEach(media => {
      if (allVideoIds.indexOf(media.id) === -1) {
        newVideos.push(media);
      }
    });
    return videos.concat(newVideos);
  }

  static removeMedia(videos: GoogleApiYouTubeVideoResource[],
                     media: GoogleApiYouTubeVideoResource): GoogleApiYouTubeVideoResource[] {
    return videos.filter((_media: GoogleApiYouTubeVideoResource) => _media.id !== media.id);
  }


  static filterVideos(videos: GoogleApiYouTubeVideoResource[], filter: string) {
    return videos.filter(video =>
      JSON.stringify(video)
        .toLowerCase()
        .includes(filter.toLowerCase())
    );
  }

  static selectNextIndex(videos: GoogleApiYouTubeVideoResource[],
                         selectedId: string,
                         filter: string,
                         isRepeat: boolean): string {
    const filteredVideos = NowPlaylistService.filterVideos(videos, filter);
    const currentIndex: number = filteredVideos.findIndex(video => video.id === selectedId);
    let nextIndex = currentIndex + 1;
    if (!filteredVideos.length) {
      nextIndex = 0;
    }
    if (filteredVideos.length === nextIndex) {
      nextIndex = isRepeat ? 0 : currentIndex;
    }

    return filteredVideos[nextIndex].id || '';
  }

  static getNextIdForPlaylist(videos: GoogleApiYouTubeVideoResource[],
                              repeat: boolean,
                              currentId: string = '') {
    let id = '';
    if (videos.length && repeat) {
      id = videos[0].id;
    }
    return id;
  }

  static selectNextOrPreviousTrack(state: INowPlaylist, filter: string): INowPlaylist {
    const videosPlaylist = state.videos;
    const currentId = state.selectedId;
    const indexOfCurrentVideo = videosPlaylist.findIndex(video => currentId === video.id);
    const isCurrentLast = indexOfCurrentVideo + 1 === videosPlaylist.length;
    const nextId = isCurrentLast
      ? NowPlaylistService.getNextIdForPlaylist(videosPlaylist, state.repeat, currentId)
      : NowPlaylistService.selectNextIndex(videosPlaylist, currentId, filter, state.repeat);
    return Object.assign({}, state, { selectedId: nextId });
  }

  static selectPreviousIndex(videos: GoogleApiYouTubeVideoResource[],
                             selectedId: string,
                             filter: string): string {
    const filteredVideos = NowPlaylistService.filterVideos(videos, filter);
    const currentIndex: number = filteredVideos.findIndex(video => video.id === selectedId);
    let previousIndex = currentIndex - 1;
    if (!filteredVideos.length || previousIndex < 0) {
      previousIndex = 0;
    }

    return filteredVideos[previousIndex].id || '';
  }


  // ???
  queueVideo(mediaId: string) {
    return this.youtubeApi.fetchVideosData(mediaId);
  }

  queueVideo2(media) {
    const playlist = this.playlistSubject.getValue();

    this.playlistSubject.next({
      ...playlist,
      videos: NowPlaylistService.addMedia(playlist.videos, media)
    });
  }

  queueVideos(medias: GoogleApiYouTubeVideoResource[]) {
    const playlist = this.playlistSubject.getValue();

    this.playlistSubject.next({
      ...playlist,
      videos: NowPlaylistService.addMedias(playlist.videos, medias)
    });
  }

  removeVideo(media) {
    const playlist = this.playlistSubject.getValue();

    this.playlistSubject.next({
      ...playlist,
      videos: NowPlaylistService.removeMedia(playlist.videos, media)
    });
  }

  // queue and select
  selectVideo(media) {
    const playlist = this.playlistSubject.getValue();

    this.playlistSubject.next({
      ...playlist, selectedId: media.id,
      videos: NowPlaylistService.addMedia(playlist.videos, media)
    });
  }

  updateFilter(filter: string) {
    const playlist = this.playlistSubject.getValue();

    this.playlistSubject.next({
      ...playlist,
      filter: filter
    });
  }

  clearPlaylist() {
    this.playlistSubject.next({
      ...this.playlistSubject.getValue(),
      videos: [], filter: '', selectedId: ''
    });
  }

  selectNextIndex() {
    const playlist = this.playlistSubject.getValue();

    this.playlistSubject.next({
      ...playlist,
      selectedId: NowPlaylistService.selectNextIndex(playlist.videos, playlist.selectedId, playlist.filter, playlist.repeat)
    });
  }

  selectPreviousIndex() {
    const playlist = this.playlistSubject.getValue();

    this.playlistSubject.next({
      ...playlist,
      selectedId: NowPlaylistService.selectPreviousIndex(playlist.videos, playlist.selectedId, playlist.filter)
    });
  }

  trackEnded() {
    const playlist = this.playlistSubject.getValue();
    this.playlistSubject.next(NowPlaylistService.selectNextOrPreviousTrack(playlist, playlist.filter));
  }

  getCurrent() {
    let media = null;
    this.playlist$.take(1).subscribe(playlist => {
      media = playlist.videos.find(video => video.id === playlist.selectedId);
    });
    return media;
  }

  updateIndexByMedia(mediaId: string) {
    this.playlistSubject.next({
      ...this.playlistSubject.getValue(), selectedId: mediaId
    });
  }

  isInLastTrack(): boolean {
    // better than bahavior subject?
    let nowPlaylist: NowPlaylist.INowPlaylist;
    this.playlist$.take(1).subscribe(_nowPlaylist => (nowPlaylist = _nowPlaylist));
    const currentVideoId = nowPlaylist.selectedId;
    const indexOfCurrentVideo = nowPlaylist.videos.findIndex(video => video.id === currentVideoId);
    const isCurrentLast = indexOfCurrentVideo + 1 === nowPlaylist.videos.length;
    return isCurrentLast;
  }

  toggleRepeat() {
    const playlist = this.playlistSubject.getValue();

    this.playlistSubject.next({
      ...playlist,
      repeat: !playlist.repeat
    });
  }

  seekToTrack(trackEvent) {
    // ???
    this.updateIndexByMedia(trackEvent.media.id);

    this.playerService.seekTo(this.mediaParser.toNumber(trackEvent.time));
  }
}
