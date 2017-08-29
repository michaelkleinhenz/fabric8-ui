import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProfileComponent } from './profile.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      { path: '', component: OverviewComponent },
      {
        path: '_spaces',
        loadChildren: './spaces/spaces.module#SpacesModule',
        data: {
          title: 'Spaces'
        }
      },
      {
        path: '_update',
        loadChildren: './update/update.module#UpdateModule',
        data: {
          title: 'Profile'
        }
      },
      {
        path: '_cleanup',
        loadChildren: './cleanup/cleanup.module#CleanupModule',
        data: {
          title: 'Cleanup'
        }
      },
      {
        path: '_tenant',
        loadChildren: './tenant/tenant.module#TenantModule',
        data: {
          title: 'Tenant'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
