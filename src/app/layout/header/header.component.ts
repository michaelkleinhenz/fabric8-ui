import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { Broadcaster, Logger } from 'ngx-base';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Context, Contexts, Space, Spaces, SpaceService } from 'ngx-fabric8-wit';
import { AuthenticationService, User, UserService } from 'ngx-login-client';
import { ContextLink, HeaderService, MenuItem, SystemStatus } from 'osio-ngx-framework';

import { Navigation } from '../../models/navigation';
import { DummyService } from '../../shared/dummy.service';
import { LoginService } from '../../shared/login.service';

/*
interface MenuHiddenCallback {
  (headerComponent: HeaderComponent): Observable<boolean>;
}
*/

@Component({
  selector: 'alm-app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  providers: []
})
export class HeaderComponent implements OnInit {

  systemContext: string = 'platform';
  currentContext: Context;
  recentContexts: Context[] = [];
  systemStatus: SystemStatus[];
  loggedInUser: User;
  followQueryParams: Object = {};
  spaces: Space[] = [];
  currentSpace: Space = null;
  modalRef: BsModalRef;

  //recent: Context[];
  //loggedInUser: User;
  //private _context: Context;
  //private _defaultContext: Context;
  //private _loggedInUserSubscription: Subscription;
  //private plannerFollowQueryParams: Object = {};
  //private eventListeners: any[] = [];
  private selectedFlow: string;
  //private space: string;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private userService: UserService,
    private logger: Logger,
    public loginService: LoginService,
    private broadcaster: Broadcaster,
    public dummy: DummyService,
    private contexts: Contexts,
    private modalService: BsModalService,
    private authentication: AuthenticationService,
    private headerService: HeaderService
  ) {
    // remove this for production
    this.headerService.clean();

    this.selectedFlow = 'start';

    // TODO is this needed?
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.broadcaster.broadcast('navigate', { url: val.url } as Navigation);
      }
    });

    /*
    this.space = '';
    contexts.current.subscribe(val => {
      this._context = val;
      this.updateMenus();
    });
    contexts.default.subscribe(val => {
      this._defaultContext = val;
    });
    contexts.recent.subscribe(val => this.recent = val);

    // Currently logged in user
    this.userService.loggedInUser.subscribe(
      val => {
        if (val.id) {
          this.loggedInUser = val;
        } else {
          this.resetData();
          this.loggedInUser = null;
        }
      }
    );
    */
  }

  private goTo(menuItem: MenuItem) {
    for (let m of menuItem.contextLinks) {
      if (m.context == 'platform') {
        if (m.type == 'internal') {
          this.logger.log('[HeaderComponent] internal link found for MenuItem: ' + m.path);
          this.goToInternal(m.path);
        } else if (m.type == 'external') {
          this.logger.log('[HeaderComponent] external link found for MenuItem: ' + m.path);
          this.goToExternal(m.path);
        } else {
          this.logger.warn('[HeaderComponent] No link found for MenuItem: ' + menuItem.id);
        }
      }
    }
  }

  private getBaseURL() {
    // TODO Integration: this might change (and possibly be a runtime configuration)
    let l = document.createElement('a');
    l.href = location.href;
    return l.protocol + '//' + l.host + '/';
  }

  private goToInternal(path: string) {
    this.logger.log('[HeaderComponent] Switching to internal route: ' + path);
    this.router.navigate([path]);
  }

  private goToExternal(path: string) {
    this.logger.log('[HeaderComponent] Switching to external route: ' + path);
    window.location.href = path;
  }

  // Event handlers

  onSelectMenuItem(menuItem: MenuItem) {
    this.goTo(menuItem);
  }

  onSelectLogout() {
    this.logger.log('[HeaderComponent] Logging out user.');
    this.authentication.logout();
    this.loggedInUser = null as User;
    this.headerService.clean();
  }

  onSelectLogin() {
    this.router.navigate(['/login']);
  }

  onSelectAbout() {
    this.logger.log('[HeaderComponent] Showing about modal.');
    // TODO Integration: this currently opens a modal dialog
    // This should be part of the header, or at least a common component in a library
  }

  onSelectCreateSpace() {
    this.logger.log('[HeaderComponent] Showing create new space.');
    // TODO Integration: this currently opens a modal dialog
    // This should either be a common component from a library OR an external link to a platform dialog
  }

  onSelectRecentContext(context: Context) {
    // TODO Integration: this may need to switch to platform in some cases (it looks like there are not only spaces in the recentContexts)
    if (context.space) {
      this.setCurrentSpace(context.space);
    // this.goToExternal(this.getBaseURL() + context.path);
    }
  }

  onSelectViewAllSpaces() {
    // TODO
    this.goToExternal(this.getBaseURL() + this.loggedInUser.id + '/_spaces');
  }

  onSelectAccountHome() {
    // TODO
    this.goToExternal(this.getBaseURL() + '_home');
  }

  onSelectUserProfile() {
    // TODO
    this.goToExternal(this.getBaseURL() + this.loggedInUser.id);
  }

  onFollowedLink(url: string) {
    // NOP
  }

  ngOnInit(): void {

    // logout can also be called by an event from other parts of the app
    this.broadcaster.on<string>('logout')
      .subscribe(message => {
        this.logger.warn('[HeaderComponent] Received logout broadcast event.');
        this.onSelectLogout();
      });

    // on an authentication error, we logout and send the user to the login
    this.broadcaster.on<any>('authenticationError')
      .subscribe(() => {
        this.logger.warn('[HeaderComponent] Received authenticationError broadcast event.');
        this.onSelectLogout();
        this.router.navigate(['/login']);
      });

    // we subscribe to the UserService to get notified when the user switches
    this.userService.getUser().subscribe(user => {
      if (user && user.id) {
        this.logger.log('[HeaderComponent] UserService signals new user ' + user.id);
        this.loggedInUser = user;
      } else {
        this.logger.warn('[HeaderComponent] UserService returned empty object user value.');
        this.loggedInUser = null;
      }
    });

    /*
    contexts.current.subscribe(val => {
      this._context = val;
      this.updateMenus();
    });
    // TODO unwrap the context, get space, wrap again
    */
    // we subscribe to the current space to get notified when the space switches. This only fires if a switch is happening, not on bootstrap
    this.spacesService.current.subscribe(space => {
      this.currentSpace = space;
      if (this.currentSpace) {
        // Note: the ""+this.currentSpace.path is needed because Space is broken
        this.logger.log('[HeaderComponent] Received from SpaceService new currentContext: ' + space.id);
        let context = this.headerService.createContext(this.currentSpace.attributes.name, '' + this.currentSpace.id, this.currentSpace, this.loggedInUser);
        this.currentContext = context;
      } else {
        this.currentContext = null;
      }
    });

    // contexts.recent.subscribe(val => this.recent = val); // TODO unwrap and wrap again
    // we subscribe to all spaces list to get notified when the spaces list changes
    this.spacesService.getAllSpaces().subscribe((spaces) => {
      this.logger.log('[HeaderComponent] Received from SpaceService new spaces list with length: ' + spaces.length);
      this.spaces = spaces as Space[];
      for (let thisSpace of this.spaces) {
        this.logger.log('[HeaderComponent] Prepare space from allSpaces: ' + thisSpace.id);
        let context = this.headerService.createContext(thisSpace.attributes.name, '' + thisSpace.id, thisSpace, this.loggedInUser);
        this.recentContexts.push(context);
        this.headerService.addRecentContext(context);
      }
      // if there is no currentSpace yet, we select the first one to be the new currentSpace
      if (!this.currentSpace) {
        this.currentSpace = spaces[0];
        if (this.currentSpace) {
          this.logger.log('[HeaderComponent] Selected new Space on result of getAllSpaces: ' + this.currentSpace.id);
          // Note: the ""+this.currentSpace.path is needed because Space is broken
          let context = this.headerService.createContext(this.currentSpace.attributes.name, '' + this.currentSpace.id, this.currentSpace, this.loggedInUser);
          this.currentContext = context;
          this.setCurrentSpace(this.currentSpace);
        } else {
          this.logger.log('[HeaderComponent] Deselected Space.');
          this.currentContext = null;
          this.setCurrentSpace(null);
        }
      }
    });

    // we preserve the iteration query params TODO: is this needed?
    this.route.queryParams.subscribe(params => {
      this.logger.warn('[HeaderComponent] QueryParams changed.');
      this.followQueryParams = {};
      if (Object.keys(params).indexOf('iteration') > -1) {
        this.followQueryParams['iteration'] = params['iteration'];
      }
    });

    // if there is no systemStatus retrieved from the storage, init it with something meaningful
    this.headerService.retrieveSystemStatus().subscribe((systemStatus: SystemStatus[]) => {
      // TODO: instead of adding template data here, retrieve the real systemStatus somewhere, because the user could have used a deepLink
      if (!systemStatus || systemStatus.length == 0) {
        this.systemStatus = [
          {
            id: 'planner',
            name: 'Planner',
            statusOk: true
          } as SystemStatus
        ];
        this.headerService.persistSystemStatus(this.systemStatus);
      }
    });
  }

  setCurrentSpace(space: Space) {
    this.logger.log('[HeaderComponent] Switching current space to ' + space.id);
    // TODO
    // [routerLink]="[m.path]", just route to url of space
  }

  openForgeWizard(addSpace: TemplateRef<any>) {
    if (this.authentication.getGitHubToken()) {
      this.selectedFlow = 'start';
      this.modalRef = this.modalService.show(addSpace, {class: 'modal-lg'});
    } else {
      this.broadcaster.broadcast('showDisconnectedFromGitHub', {'location': window.location.href });
    }
  }

  closeModal($event: any): void {
    this.modalRef.hide();
  }

  selectFlow($event) {
    this.selectedFlow = $event.flow;
    this.space = $event.space;
  }

  /*
  get context(): Context {
    if (this.router.url.startsWith('/_home')) {
      return this._defaultContext;
    } else {
      return this._context;
    }
  }
  */

  get isGettingStartedPage(): boolean {
    return (this.router.url.indexOf('_gettingstarted') !== -1);
  }

  /*
  private checkContextUserEqualsLoggedInUser(): Observable<boolean> {
    return Observable.combineLatest(
      Observable.of(this.context).map(val => val.user.id),
      this.userService.loggedInUser.map(val => val.id),
      (a, b) => (a !== b)
    );
  }
  */
}
