import { Component, OnInit } from '@angular/core';

declare function init_plugins();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: []
})
export class PagesComponent implements OnInit {

  CurYear: number;

  constructor() { }

  ngOnInit() {
    init_plugins();
    this.CurYear = new Date().getFullYear();
  }

}
