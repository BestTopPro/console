import { Component, OnInit } from '@angular/core';

import { Page } from '../types';
import { WpxService } from '../wpx.service';

@Component({
  selector: 'wpx-page-header',
  templateUrl: './wpx-page-header.component.html'
})
export class WpxPageHeaderComponent implements OnInit {
  paths!: Map<string, Page>;

  constructor(public wpx: WpxService) {}

  ngOnInit(): void {
    this.wpx.paths.subscribe(v => {
      if (v.size) {
        this.paths = v;
      }
    });
  }
}