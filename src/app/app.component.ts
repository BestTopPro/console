import { Component, OnInit } from '@angular/core';
import { BitConfigService, BitService } from 'ngx-bit';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  constructor(
    private bit: BitService,
    private config: BitConfigService,
    private notification: NzNotificationService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.config.setupLocales(import('./app.language'));
    this.config.setupHttpInterceptor(
      map(res => {
        if (res.error) {
          switch (res.msg) {
            case 'refresh token verification expired':
              this.notification.warning(this.bit.l.auth, this.bit.l.authInvalid, {
                nzKey: 'authInvalid'
              });
              this.router.navigateByUrl('/login');
              break;
          }
        }
        return res;
      })
    );
  }
}
