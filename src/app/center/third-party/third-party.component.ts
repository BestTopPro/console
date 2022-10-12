import { Component } from '@angular/core';
import { timer } from 'rxjs';

import { WpxService } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-center-third-party',
  templateUrl: './third-party.component.html'
})
export class ThirdPartyComponent {
  constructor(public wpx: WpxService, private message: NzMessageService) {}

  linkFeishu(): void {
    this.wpx.oauth('link').subscribe(v => {
      const popup = window.open(v, '', 'width=800,height=640');
      const $timer = timer(0, 500).subscribe(() => {
        if (popup?.closed) {
          $timer.unsubscribe();
          this.wpx.getUser().subscribe(() => {});
        }
      });
    });
  }

  unlinkFeishu(): void {
    this.wpx.setUser('unlink', { type: 'feishu' }).subscribe(() => {
      this.message.success('关联已取消');
      this.wpx.getUser().subscribe(() => {});
    });
  }
}