import { Injectable, NgZone } from '@angular/core';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/buffer';
import 'rxjs/add/operator/catch';
import { of } from 'rxjs/observable/of';

import { YoutubeApi } from '../api/youtube-api';
import { Authorization } from './authorization.service';

import { GoogleBasicProfile, IUserProfile } from '../models/user-profile';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AsyncLocalStorage } from 'angular-async-local-storage';

const INIT_STATE: IUserProfile = {
  access_token: '',
  playlists: [],
  profile: {},
  viewedPlaylist: ''
};

@Injectable()
export class UserProfile {
  public userProfile$: Observable<IUserProfile>;
  private userProfileSubject: BehaviorSubject<IUserProfile>;

  constructor(private zone: NgZone,
              public youtubeApiService: YoutubeApi,
              private authorization: Authorization,
              private localStorage: AsyncLocalStorage) {

    this.userProfileSubject = new BehaviorSubject(INIT_STATE);
    this.userProfile$ = this.userProfileSubject.asObservable();

    this.localStorage.getItem('user-profile')
      .filter(data => data !== null).subscribe((data) => {
      this.userProfileSubject.next(data);
    });

    this.userProfileSubject.filter(l => l !== INIT_STATE)
      .distinctUntilChanged()
      .switchMap(user => {
        return this.localStorage.setItem('user-profile', user);
      }).subscribe();

    authorization.authData$.subscribe(googleUser => {
      if (googleUser === null) {
        this.userProfileSubject.next({
          ...INIT_STATE,
        });
      } else {
        this.updateToken(googleUser.getAuthResponse().access_token);
        this.userProfileRecieved(googleUser.getBasicProfile());
      }
    });
  }

  updateToken(token: string) {
    this.userProfileSubject.next({
      ...this.userProfileSubject.getValue(),
      access_token: token,
      playlists: []
    });

    this.youtubeApiService.fetchAllPlaylists().catch((error: Error) => {
      console.log(`error in fetching user's playlists ${error}`);
      return of(error);
    }).subscribe(response => this.updateData(response));
  }

  private updateData(response: any) {
    this.addPlayList(response);

    this.userProfileCompleted();
  }

  private addPlayList(items: any) {
    const userProfile = this.userProfileSubject.getValue();
    this.userProfileSubject.next({
      ...userProfile,
      playlists: [...userProfile.playlists, ...items]
    });
  }

  private userProfileCompleted() {
    // ??? what is this for? too many action placeholders
  }

  userProfileRecieved(profile: gapi.auth2.BasicProfile) {
    this.updateUserProfile(this.toUserJson(profile));
  }


  private updateUserProfile(profile: GoogleBasicProfile) {
    this.userProfileSubject.next({
      ...this.userProfileSubject.getValue(),
      profile
    });
  }

  private toUserJson(profile): GoogleBasicProfile {
    const _profile: GoogleBasicProfile = {};
    if (profile) {
      _profile.imageUrl = profile.getImageUrl();
      _profile.name = profile.getName();
    }
    return _profile;
  }


}
