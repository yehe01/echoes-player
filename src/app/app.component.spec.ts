import { async, TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppLayoutService, INIT_STATE, VersionCheckerService } from './core/services';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Themes } from './app.themes';
import { RouterTestingModule } from '@angular/router/testing';

@Component({ selector: 'app-player', template: '' })
class AppPlayerComponentStub {
}

@Component({ selector: 'app-sidebar', template: '' })
class AppSidebarComponentStub {
}

describe('AppComponent', () => {
  let appLayout;

  beforeEach(async(() => {
    const versionCheckerSpy = jasmine.createSpyObj('versionCheckerSpy',
      ['start']
    );
    const appLayoutSpy = jasmine.createSpyObj('appLayoutSpy',
      ['changeTheme, toggleSidebar']
    );

    appLayoutSpy.appLayout$ = new BehaviorSubject<any>(INIT_STATE);

    const injector = TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        AppPlayerComponentStub,
        AppSidebarComponentStub
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        RouterTestingModule
      ],
      providers: [
        { provide: VersionCheckerService, useValue: versionCheckerSpy },
        { provide: AppLayoutService, useValue: appLayoutSpy }]
    });

    appLayout = injector.get(AppLayoutService);
  }));


  function compileComponents(): Promise<any> {
    return TestBed.compileComponents()
      .then(() => TestBed.createComponent(AppComponent));
  }

  it('should create the app', async(() => {
    compileComponents().then(fixture => {
      const app = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
    });
  }));

  it('should change theme', async(() => {
    compileComponents().then(fixture => {
      fixture.detectChanges();

      expect(fixture.nativeElement.classList).toContain('arctic');

      appLayout.appLayout$.next({
        sidebarExpanded: true,
        requestInProcess: false,
        version: {
          semver: '',
          isNewAvailable: false,
          checkingForVersion: false
        },
        theme: Themes[1],
        themes: Themes.sort()
      });

      fixture.detectChanges();

      expect(fixture.nativeElement.classList).toContain('halloween');

    });
  }));


  it('should have a AppPlayerComponent', async(() => {
    compileComponents().then(fixture => {
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('app-player');
      expect(element).not.toEqual(null);
    });
  }));

  it('should have a AppSidebarComponent', async(() => {
    compileComponents().then(fixture => {
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('app-sidebar');
      expect(element).not.toEqual(null);
    });
  }));

  it('should have a RouterOutlet', async(() => {
    compileComponents().then(fixture => {
      fixture.detectChanges();
      const element = fixture.nativeElement.querySelector('router-outlet');
      expect(element).not.toEqual(null);
    });
  }));
});
