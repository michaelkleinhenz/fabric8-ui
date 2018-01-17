import { Injectable } from '@angular/core';

import { cloneDeep } from 'lodash';
import { Context, ContextType, ContextTypes } from 'ngx-fabric8-wit';

import { ContextLink, MenuItem } from 'osio-ngx-framework';
import { MenuedContextType } from './menued-context-type';

@Injectable()
export class MenusService {

  readonly menus: Map<ContextType, MenuItem[]>;

  constructor() {

    this.menus = new Map<ContextType, MenuItem[]>();
    let menuItems: MenuItem[] = [
          {
            id: 'settings',
            name: '',
            icon: 'pficon pficon-settings',
            active: false,
            contextLinks: [
              {
                context: 'platform',
                type: 'internal',
                path: 'settings'
              } as ContextLink,
              {
                context: 'planner',
                type: 'external',
                path: 'http://ext.menuEntry0.someContext1/'
              } as ContextLink
            ] as ContextLink[],
            menus: [
              {
                id: 'settings_areas',
                name: 'Areas',
                icon: '',
                active: false,
                contextLinks: [
                  {
                    context: 'platform',
                    type: 'internal',
                    path: ''
                  } as ContextLink,
                  {
                    context: 'planner',
                    type: 'external',
                    path: 'http://ext.menuEntry0.someContext1/'
                  } as ContextLink
                ] as ContextLink[],
                menus: [] as MenuItem[]
              } as MenuItem,
              {
                id: 'settings_collaborators',
                name: 'Collaborators',
                icon: '',
                active: false,
                contextLinks: [
                  {
                    context: 'platform',
                    type: 'internal',
                    path: 'collaborators'
                  } as ContextLink,
                  {
                    context: 'planner',
                    type: 'external',
                    path: 'http://ext.menuEntry0.someContext1/'
                  } as ContextLink
                ] as ContextLink[],
                menus: [] as MenuItem[]
              } as MenuItem
            ] as MenuItem[]
          } as MenuItem, {
            id: 'analyze',
            name: 'Analyze',
            icon: '',
            active: false,
            contextLinks: [
              {
                context: 'platform',
                type: 'internal',
                path: ''
              } as ContextLink,
              {
                context: 'planner',
                type: 'external',
                path: 'http://ext.menuEntry0.someContext1/'
              } as ContextLink
            ] as ContextLink[],
            menus: [ ] as MenuItem[]
          } as MenuItem, {
            id: 'planner',
            name: 'Plan',
            icon: '',
            contextLinks: [
              {
                context: 'planner',
                type: 'internal',
                path: '/plan/list'
              } as ContextLink,
              {
                context: 'platform',
                type: 'external',
                path: 'http://ext.menuEntry1.someContext1/'
              } as ContextLink
            ] as ContextLink[],
            menus: [
              {
                id: 'planner_list',
                name: 'Backlog',
                icon: 'fa fa-heart',
                contextLinks: [
                  {
                    context: 'planner',
                    type: 'internal',
                    path: '/plan/list'
                  } as ContextLink,
                  {
                    context: 'platform',
                    type: 'external',
                    path: 'http://ext.menuEntry1_1.someContext1/'
                  } as ContextLink
                ] as ContextLink[]
              } as MenuItem,
              {
                id: 'planner_board',
                name: 'Board',
                icon: 'fa fa-heart',
                contextLinks: [
                  {
                    context: 'planner',
                    type: 'internal',
                    path: '/plan/board'
                  } as ContextLink,
                  {
                    context: 'platform',
                    type: 'external',
                    path: 'http://ext.menuEntry1_2.someContext1/'
                  } as ContextLink
                ] as ContextLink[]
              } as MenuItem
            ] as MenuItem[]
          } as MenuItem,
          this.getCreateMenuItems()
        ];

        // store the menus on the 'space' context type key
        this.menus.set(ContextTypes.BUILTIN.get('space'), menuItems);
  }

  public attach(context: Context) {
    if (!(context.type instanceof MenuedContextType || (<MenuedContextType> context.type).menus)) {
      // Take a copy of the context to attach menus to (not sure we need to do this)
      let res = cloneDeep(context.type) as MenuedContextType;
      // Take a copy of the menus and attach them
      res.menus = cloneDeep(this.menus.get(context.type));
      if (!res.menus) {
        console.log('Failed to attach menus to', context.type);
        return;
      }
      // TODO: someone should seriously refactor this!
      for (let n of res.menus) {
        for (let l of n.contextLinks) {
          l.path = this.buildPath(context.path, l.path);
          if (n.menus) {
            for (let o of n.menus) {
              for (let sl of o.contextLinks) {
                sl.path = this.buildPath(context.path, l.path, sl.path);
              }
            }
          }
        }
      }
      context.type = res;
    }
  }

  private buildPath(...args: string[]): string {
    let res = '';
    for (let p of args) {
      if (p.startsWith('/') || p.startsWith('http')) {
        res = p;
      } else {
        res = res + '/' + p;
      }
      res = res.replace(/\/*$/, '');
    }
    return res;
  }

  private getCreateMenuItems(): MenuItem {
    const displayDeployments = (ENV === 'development');

    let menus: MenuItem[] = [
      {
        id: 'codebases',
        name: 'Codebases',
        icon: '',
        active: false,
        contextLinks: [
          {
            context: 'platform',
            type: 'internal',
            path: ''
          } as ContextLink,
          {
            context: 'planner',
            type: 'external',
            path: 'http://ext.menuEntry0.someContext1/'
          } as ContextLink
        ] as ContextLink[],
        menus: [ ] as MenuItem[]
      } as MenuItem,
      {
        id: 'pipelines',
        name: 'Pipelines',
        icon: '',
        active: false,
        contextLinks: [
          {
            context: 'platform',
            type: 'internal',
            path: ''
          } as ContextLink,
          {
            context: 'planner',
            type: 'external',
            path: 'http://ext.menuEntry0.someContext1/'
          } as ContextLink
        ] as ContextLink[],
        menus: [ ] as MenuItem[]
      } as MenuItem,
      {
        id: 'applications',
        name: 'Applications',
        icon: '',
        active: false,
        contextLinks: [
          {
            context: 'platform',
            type: 'internal',
            path: ''
          } as ContextLink,
          {
            context: 'planner',
            type: 'external',
            path: 'http://ext.menuEntry0.someContext1/'
          } as ContextLink
        ] as ContextLink[],
        menus: [ ] as MenuItem[]
      } as MenuItem,
      {
        id: 'environments',
        name: 'Environments',
        icon: '',
        active: false,
        contextLinks: [
          {
            context: 'platform',
            type: 'internal',
            path: ''
          } as ContextLink,
          {
            context: 'planner',
            type: 'external',
            path: 'http://ext.menuEntry0.someContext1/'
          } as ContextLink
        ] as ContextLink[],
        menus: [ ] as MenuItem[]
      } as MenuItem
    ] as MenuItem[];

    if (displayDeployments) {
      menus.push({
          id: 'deployments',
          name: 'Deployments',
          icon: '',
          active: false,
          contextLinks: [
            {
              context: 'platform',
              type: 'internal',
              path: ''
            } as ContextLink,
            {
              context: 'planner',
              type: 'external',
              path: 'http://ext.menuEntry0.someContext1/'
            } as ContextLink
          ] as ContextLink[],
          menus: [ ] as MenuItem[]
        } as MenuItem
      );
    }

    return {
      id: 'create',
      name: 'Create',
      icon: '',
      active: true,
      contextLinks: [
        {
          context: 'platform',
          type: 'internal',
          path: 'create'
        } as ContextLink,
        {
          context: 'planner',
          type: 'external',
          path: 'http://ext.menuEntry0.someContext1/'
        } as ContextLink
      ] as ContextLink[],
      menus: [ ] as MenuItem[]
    } as MenuItem;
  }
}
