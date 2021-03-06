import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Authorization } from '../../core/services';
import { UserProfile } from './user-profile.service';

@Component({
  selector: 'app-user',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./user.scss'],
  template: `
  <article>
    <app-navbar
      [header]="'My Profile - My Playlists'"
      [headerIcon]="'heart'"
    ></app-navbar>
    <p *ngIf="!(isSignedIn$ | async)" class="well lead">
      To view your playlists in youtube, you need to sign in.
      <button class="btn btn-lg btn-primary"
        (click)="signInUser()">
        <i class="fa fa-google"></i> Sign In
      </button>
    </p>
    <router-outlet></router-outlet>
  </article>
  `
})
export class UserComponent implements OnInit {
  isSignedIn$ = this.userProfile.userProfile$.map(user => user.access_token !== '');

  constructor(
    private authorization: Authorization,
    public userProfile: UserProfile,
  ) {}

  ngOnInit () {}

  signInUser () {
    this.authorization.signIn();
  }
}
