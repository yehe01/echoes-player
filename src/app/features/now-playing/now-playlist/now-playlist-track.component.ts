import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { MediaParserService } from '../../../core/services';

@Component({
  selector: 'now-playlist-track',
  styleUrls: ['./now-playlist-track.scss'],
  template: `
  <div class="now-playlist-track__trigger">
    <div class="track-contents">
      <section class="video-thumb playlist-track__thumb"
        (click)="markSelected(video)">
        <span class="track-number">{{ index + 1 }}</span>
        <img draggable="false" class="video-thumb__image"
        [src]="videoThumb"
        xtitle="Drag to sort">
        <span class="badge badge-info">
          {{ video.contentDetails.duration | toFriendlyDuration }}
        </span>
      </section>

      <section class="video-title" (click)="markSelected(video)" [tooltip]="video.snippet.title">{{ video.snippet.title }}</section>
      </div>
    <aside class="playlist-track__content">
      <button class="btn label bg-primary fa fa-list-ul playlist-track"
        *ngIf="isPlaylistMedia(video)"
        (click)="handleToggleTracks($event, video)"
        tooltip="Album Track - click to select cued tracks"
      ></button>
      <span class="label label-danger ux-maker remove-track" tooltip="Remove From Playlist"
        (click)="remove.emit(video)"><i class="fa fa-trash"></i></span>
    </aside>
    <article *ngIf="displayTracks" class="track-tracks list-group">
      <aside class="album-tracks-heading">Tracks</aside>
      <button type="button" class="list-group-item btn-transparent"
        *ngFor="let track of tracks"
        (click)="handleSelectTrack($event, track, video)">
        {{ track }}
      </button>
    </article>
  </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NowPlaylistTrackComponent implements OnInit {
  @Input() video: GoogleApiYouTubeVideoResource;
  @Input() index: number;

  @Output() remove = new EventEmitter<GoogleApiYouTubeVideoResource>();
  @Output() select = new EventEmitter<GoogleApiYouTubeVideoResource>();
  @Output() selectTrack = new EventEmitter<{ time: string, media: GoogleApiYouTubeVideoResource }>();

  displayTracks = false;
  tracks: string[] = [];

  constructor(public mediaParser: MediaParserService) { }

  ngOnInit() { }

  isPlaylistMedia(media: GoogleApiYouTubeVideoResource) {
    console.log('is playlist media');
    const tracks = this.mediaParser.extractTracks(media);
    const isArray = Array.isArray(tracks);
    if (isArray) {
      this.parseAndSaveTracks(tracks);
    }
    return isArray && this.tracks.length;
  }

  parseAndSaveTracks(tracks: string[]) {
    this.tracks = this.mediaParser.parseTracks(tracks);
  }

  toggleTracks(media: GoogleApiYouTubeVideoResource) {
    this.displayTracks = !this.displayTracks;
    return this.displayTracks;
  }

  handleToggleTracks(event: Event, media: GoogleApiYouTubeVideoResource) {
    event.stopImmediatePropagation();
    this.toggleTracks(media);
  }

  handleSelectTrack($event: Event, track: string, media: GoogleApiYouTubeVideoResource) {
    $event.stopImmediatePropagation();
    const time = this.mediaParser.extractTime(track);
    if (time) {
      this.selectTrack.emit({ time: time[0], media });
    }
  }

  markSelected(video: GoogleApiYouTubeVideoResource) {
    this.select.emit(video);
  }

  get videoThumb() {
    // the type of video is missing the thumbnails object
    return this.video.snippet.thumbnails['default']['url'];
  }
}
