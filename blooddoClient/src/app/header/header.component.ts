import { Component } from '@angular/core';

@Component({
    selector: 'app-header',
    styles: [`
      header {
          padding: 1em;
          color: white;
          background-color: black;
          clear: left;
          text-align: center;
      }
  `],
  template: `
  <header>
     <h1>Welcome to Blooddo Service</h1>
  </header>
  `
})
export class HeaderComponent {}
