import { Component } from '@angular/core';

import { RoutesListComponent } from '@features';

@Component({
  selector: 'app-root',
  imports: [RoutesListComponent],
  templateUrl: './app.html',
  styleUrl: './app.less'
})
export class App {}
