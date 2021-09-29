import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  Input,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild
} from '@angular/core';

import { InputBoolean } from 'ng-zorro-antd/core/util';

import { WpxLayoutService } from '../wpx-layout.service';
import { WpxElementActionDirective } from './wpx-element-action.directive';
import { WpxElementAlertDirective } from './wpx-element-alert.directive';
import { WpxElementFooterDirective } from './wpx-element-footer.directive';
import { WpxElementTagsDirective } from './wpx-element-tags.directive';

@Component({
  selector: 'wpx-element',
  template: `<ng-template><ng-content></ng-content></ng-template>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WpxElementComponent implements OnInit, AfterContentInit, AfterViewInit {
  @Input() @InputBoolean() skip?: any;
  @Input() @InputBoolean() back?: any;
  @Input() title?: string | Record<string, string>;
  @Input() subTitle?: string | Record<string, string>;

  @ContentChild(WpxElementAlertDirective, { read: TemplateRef }) alert?: TemplateRef<any>;
  @ContentChild(WpxElementTagsDirective, { read: TemplateRef }) tags?: TemplateRef<any>;
  @ContentChildren(WpxElementActionDirective, { read: TemplateRef }) actions?: QueryList<TemplateRef<any>>;
  @ViewChild(TemplateRef) content?: TemplateRef<any>;
  @ContentChild(WpxElementFooterDirective, { read: TemplateRef }) footer?: TemplateRef<any>;

  constructor(private wpxLayout: WpxLayoutService) {}

  ngOnInit(): void {
    this.wpxLayout.skip.next(!!this.skip);
    this.wpxLayout.back.next(!!this.back);
    this.wpxLayout.title.next(this.title || null);
    this.wpxLayout.subTitle.next(this.subTitle || null);
  }

  ngAfterContentInit() {
    this.wpxLayout.alert.next(this.alert || null);
    this.wpxLayout.tags.next(this.tags || null);
    this.wpxLayout.actions.next(this.actions || null);
    this.wpxLayout.footer.next(this.footer || null);
  }

  ngAfterViewInit() {
    this.wpxLayout.content.next(this.content || null);
  }
}
