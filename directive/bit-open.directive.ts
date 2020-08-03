import { Directive, HostListener, Input } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { BitService } from 'ngx-bit';

@Directive({
  selector: '[bitOpen]'
})
export class BitOpenDirective {
  @Input() bitOpen: any[];
  @Input() extras: NavigationExtras;
  @Input() bitTrigger = 'click';

  constructor(
    private bit: BitService
  ) {
  }

  @HostListener('click')
  click() {
    if (this.bitTrigger === 'click') {
      this.bit.open(this.bitOpen, this.extras);
    }
  }

  @HostListener('touchstart')
  touch() {
    if (this.bitTrigger === 'touch') {
      this.bit.open(this.bitOpen, this.extras);
    }
  }
}