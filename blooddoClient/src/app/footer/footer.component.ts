import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    styles: [`
      footer {
          padding: 1em;
          color: white;
          background-color: black;
          clear: left;
          text-align: center;
      }
  `],
  template: `
  <footer>Made by Konsta for Crossover</footer>
  `
})
export class FooterComponent {}
