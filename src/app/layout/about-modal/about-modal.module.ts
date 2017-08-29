import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';

import { ModalModule } from 'ng2-bootstrap';
import { AboutModalComponent }     from './about-modal.component';

@NgModule({
  imports:      [ CommonModule, ModalModule.forRoot() ],
  declarations: [ AboutModalComponent ],
  exports: [ AboutModalComponent, ModalModule ]
})
export class AboutModalModule {
  constructor() {}
}
