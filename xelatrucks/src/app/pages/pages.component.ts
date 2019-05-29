import { Component, OnInit } from '@angular/core';


declare function init_select2();
declare function init_plugins();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: []
})
export class PagesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    //init_select2();
    init_plugins();
  }

  select2() {
    console.log('pages');
    init_select2();
  }

}
