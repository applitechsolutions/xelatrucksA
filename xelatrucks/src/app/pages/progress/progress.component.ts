import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styles: []
})
export class ProgressComponent implements OnInit {

  url = 'assets/vendor/select2/js/select2.js';
  loadAPI: any;

  constructor() { }

  ngOnInit() {
    // this.loadAPI = new Promise( resolve => {
    //   console.log('Resulviendo promesa...');
    //   this.loadScript();
    // });
  }

  public loadScript() {
    console.log('Preparando para cargar...');
    const node = document.createElement('script');
    node.src = this.url;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('body')[0].appendChild(node);
  }

}
