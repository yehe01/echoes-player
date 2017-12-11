import { TestBed, inject, } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { YoutubeSearchApi } from './youtube-search.api';
import { YoutubeApi } from './youtube-api';

describe('Youtube Search Service', () => {
  let service: YoutubeSearchApi;
  let youtubeApiSpy: YoutubeApi;

  beforeEach(() => {
    youtubeApiSpy = jasmine.createSpyObj('youtubeApiSpy',
      [ 'search' ]
    );

    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [
        YoutubeSearchApi,
        { provide: YoutubeApi, useValue: youtubeApiSpy },
      ]
    });
  });

  beforeEach(inject([YoutubeSearchApi], (youtubeSearch) => {
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
});
