import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TooltipModule } from 'ngx-tooltip';
import { NowPlaylistTrackComponent } from './now-playlist-track.component';
import { PIPES } from '../../../shared/pipes';
import { MediaParserService } from '../../../core/services';
import { VideoMock } from '../../../../../tests/mocks/now-playlist-track.mocks';

describe('NowPlaylistTrackComponent', () => {
  let component: NowPlaylistTrackComponent;
  let fixture: ComponentFixture<NowPlaylistTrackComponent>;

  function createComponent(video = VideoMock) {
    fixture = TestBed.createComponent(NowPlaylistTrackComponent);
    component = fixture.componentInstance;
    component.video = <any>video;
    fixture.detectChanges();
  }

  beforeEach(async(() => {
    const mediaParserSpy = jasmine.createSpyObj('mediaParserSpy', [
      'extractTracks', 'verifyTracksCue', 'extractTime', 'parseTracks'
    ]);
    TestBed.configureTestingModule({
      imports: [TooltipModule],
      declarations: [NowPlaylistTrackComponent, ...PIPES],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MediaParserService, useValue: mediaParserSpy },
      ]
    })
      .compileComponents();
  }));

  it('should create a component', () => {
    createComponent();
    expect(component).toBeDefined();
  });

  it('should select the track when title is clicked', () => {
    const trigger = fixture.debugElement.query(By.css('.video-title'));
    spyOn(component.select, 'emit');
    const actual = component.select.emit;
    trigger.triggerEventHandler('click', {});
    expect(actual).toHaveBeenCalled();
  });
});
