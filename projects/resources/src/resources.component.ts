import { Component } from '@angular/core';

import { WpxService } from '@weplanx/common';

@Component({
  selector: 'wpx-resources',
  template: `
    <nz-layout class="main">
      <wpx-header></wpx-header>
      <nz-layout class="wpx-container">
        <nz-sider class="wpx-sider" nzTheme="light">
          <ul nz-menu nzMode="inline">
            <li nz-menu-group nzTitle="内容生成器">
              <ul>
                <li nz-menu-item nzMatchRouter [routerLink]="['factory', 'pages']">
                  <i nz-icon nzType="layout"></i> <span>页面</span>
                </li>
              </ul>
            </li>

            <li nz-menu-group nzTitle="媒体资源">
              <ul>
                <li nz-menu-item nzMatchRouter [routerLink]="['media', 'pictures']">
                  <i nz-icon nzType="picture"></i><span>图库</span>
                </li>
                <li nz-menu-item nzMatchRouter [routerLink]="['media', 'videos']">
                  <i nz-icon nzType="play-circle"></i><span>视频</span>
                </li>
              </ul>
            </li>
          </ul>
        </nz-sider>
        <nz-layout style="overflow: auto">
          <nz-content>
            <router-outlet></router-outlet>
          </nz-content>
        </nz-layout>
      </nz-layout>
    </nz-layout>
  `
})
export class ResourcesComponent {
  constructor(public wpx: WpxService) {}
}