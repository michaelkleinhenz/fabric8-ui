import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { RestangularModule } from 'ng2-restangular';

import {
  // Base functionality for the runtime console
  KubernetesStoreModule,
  KubernetesRestangularModule
} from '../../../a-runtime-console/index';

import { CreateComponent } from './create.component';
import { CreateRoutingModule } from './create-routing.module';

import { CodebasesModule } from './codebases/codebases.module';

@NgModule({
  imports: [
    CodebasesModule,
    CommonModule,
    CreateRoutingModule
  ],
  declarations: [CreateComponent],
  providers: [

  ]
})
export class CreateModule {
  constructor(http: Http) { }
}
