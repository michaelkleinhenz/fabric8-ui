import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-security',
  templateUrl: 'security.component.html',
  styleUrls: ['./security.component.less']
})
export class SecurityComponent implements OnInit {

  constructor(
    private router: Router) {
  }

  ngOnInit() {

  }

}
