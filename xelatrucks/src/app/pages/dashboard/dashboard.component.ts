import { Component, OnInit } from '@angular/core';

import { PagesComponent } from '../pages.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: ['../../app.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private parent: PagesComponent) { }

  ngOnInit() {
    //this.parent.select2();
  }

}
