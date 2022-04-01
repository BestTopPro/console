import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { WpxService } from '@weplanx/common';

@Component({
  selector: 'wpx-center',
  template: `
    <nz-layout class="main">
      <wpx-header></wpx-header>
      <nz-layout class="container">
        <nz-sider class="sider" nzTheme="light">
          <ul nz-menu nzMode="inline">
            <li nz-menu-group nzTitle="我的">
              <ul>
                <li nz-menu-item nzMatchRouter [routerLink]="['mine', 'workbench']">
                  <i nz-icon nzType="desktop"></i> <span>工作台</span>
                </li>
                <li nz-menu-item nzMatchRouter [routerLink]="['mine', 'calendar']">
                  <i nz-icon nzType="calendar"></i> <span>日历</span>
                </li>
                <li nz-menu-item nzMatchRouter [routerLink]="['mine', 'notebook']">
                  <i nz-icon nzType="book"></i> <span>记事本</span>
                </li>
              </ul>
            </li>
            <li nz-menu-group nzTitle="个人设置">
              <ul>
                <li nz-menu-item nzMatchRouter [routerLink]="['profile', 'info']">
                  <i nz-icon nzType="solution"></i> <span>基本信息</span>
                </li>
                <li nz-menu-item nzMatchRouter [routerLink]="['profile', 'safety']">
                  <i nz-icon nzType="safety"></i> <span>安全设置</span>
                </li>
                <li nz-menu-item nzMatchRouter [routerLink]="['profile', 'linked']">
                  <i nz-icon nzType="link"></i> <span>帐号绑定</span>
                </li>
                <li nz-menu-item nzMatchRouter [routerLink]="['profile', 'notify']">
                  <i nz-icon nzType="notification"></i> <span>通知设置</span>
                </li>
              </ul>
            </li>
            <li nz-menu-group nzTitle="审计日志">
              <ul>
                <li nz-menu-item nzMatchRouter [routerLink]="['audit', 'session']">
                  <i nz-icon nzType="audit"></i> <span>会话记录</span>
                </li>
                <li nz-menu-item nzMatchRouter [routerLink]="['audit', 'history']">
                  <i nz-icon nzType="history"></i> <span>操作记录</span>
                </li>
              </ul>
            </li>
          </ul>
        </nz-sider>
        <nz-layout style="overflow: auto">
          <nz-content [class.content]="!noPadding">
            <router-outlet></router-outlet>
          </nz-content>
        </nz-layout>
      </nz-layout>
    </nz-layout>
  `
})
export class CenterComponent implements OnInit {
  noPadding = false;

  constructor(public wpx: WpxService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.wpx.layout.subscribe(option => {
      this.noPadding = option.noPadding ?? false;
      this.cd.detectChanges();
    });
  }
}
