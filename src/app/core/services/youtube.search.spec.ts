import { TestBed, inject, } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { YoutubeSearchService } from './youtube.search';
import { YoutubeApi } from '../api/youtube-api';

describe('Youtube Search Service', () => {
  let service: YoutubeSearchService;
  let youtubeApiSpy: YoutubeApi;

  beforeEach(() => {
    youtubeApiSpy = jasmine.createSpyObj('youtubeApiSpy',
      [ 'search' ]
    );

    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [
        YoutubeSearchService,
        { provide: YoutubeApi, useValue: youtubeApiSpy },
      ]
    });
  });

  beforeEach(inject([YoutubeSearchService], (youtubeSearch) => {
    service = youtubeSearch;
  }));

  it('should have a search method', () => {
    const actual = service.search;
    expect(actual).toBeDefined();
  });

  it('should perform search with the api', () => {
    const actual = youtubeApiSpy.search;
    service.search('ozrics');
    expect(actual).toHaveBeenCalled();
  });

  it('should search with same value when searching more', () => {
    const query = 'ozrics';
    const nextPageToken = 'fdsaf#42441';
    service.search(query);
    service.searchMore(nextPageToken);
    service.search(query);
    const actual = youtubeApiSpy.search;
    const expected = {
      part: 'snippet,id',
      q: query,
      type: 'video',
      pageToken: nextPageToken
    };
    expect(actual).toHaveBeenCalledWith('search', expected);
  });

  it('should reset the page token', () => {
    const query = 'ozrics';
    service.searchMore('fakePageToken$#@$$!');
    service.resetPageToken();
    service.search(query);
    const actual = youtubeApiSpy.search;
    const expected = {
      part: 'snippet,id',
      q: query,
      type: 'video',
      pageToken: ''
    };
    expect(actual).toHaveBeenCalledWith('search', expected);
  });
});
