import { Injectable } from '@angular/core';
import { NowPlaylistService } from './index';
import { AppPlayerService } from './app-player.service';
import { YoutubeApi } from '../api/youtube-api';

@Injectable()
export class AppService {
  constructor(private nowPlaylistService: NowPlaylistService,
              private appPlayerService: AppPlayerService,
              private youtubeApiService: YoutubeApi) {
  }

  playPlaylist(playlist: GoogleApiYouTubePlaylistResource) {
    this.youtubeApiService
      .fetchAllPlaylistItems(playlist.id)
      .subscribe((items: GoogleApiYouTubeVideoResource[]) => {
        this.nowPlaylistService.queueVideos(items);
        this.nowPlaylistService.selectVideo(items[0]);
        this.appPlayerService.loadAndPlay(items[0]);
      });
  }

  playUserPlaylist(playlist: GoogleApiYouTubePlaylistResource) {
    this.youtubeApiService
      .fetchPlaylistItems(playlist.id)
      .subscribe((items: GoogleApiYouTubeVideoResource[]) => {
        this.nowPlaylistService.queueVideos(items);
        this.nowPlaylistService.selectVideo(items[0]);
        this.appPlayerService.loadAndPlay(items[0]);

      });
  }

  queuePlaylist(playlist: GoogleApiYouTubePlaylistResource) {
    this.youtubeApiService.fetchAllPlaylistItems(playlist.id)
      .subscribe((playlistItems: GoogleApiYouTubeVideoResource[]) => {
        this.nowPlaylistService.queueVideos(playlistItems);
      });
  }

  queueUserPlaylist(playlist: GoogleApiYouTubePlaylistResource) {
    this.youtubeApiService.fetchPlaylistItems(playlist.id)
      .subscribe((playlistItems: GoogleApiYouTubeVideoResource[]) => {
        this.nowPlaylistService.queueVideos(playlistItems);
      });
  }

  playVideo(media: GoogleApiYouTubeVideoResource) {
    this.appPlayerService.loadAndPlay(media);
    this.nowPlaylistService.selectVideo(media);
  }

  queueVideo(media: GoogleApiYouTubeVideoResource) {
    this.nowPlaylistService.queueVideo2(media);
  }

  removeVideoFromPlaylist(media: GoogleApiYouTubeVideoResource) {
    this.nowPlaylistService.removeVideo(media);
  }
}
