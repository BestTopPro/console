import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { WpxService } from '@weplanx/ng';
import { NzModalRef } from 'ng-zorro-antd/modal';
import validator from 'validator';

import { FactorySerivce } from '../../factory.service';

@Component({
  selector: 'app-factory-schema-default',
  templateUrl: './default.component.html'
})
export class DefaultComponent implements OnInit {
  /**
   * 载入文本
   */
  @Input() body!: string;
  /**
   * 表单
   */
  form!: UntypedFormGroup;
  /**
   * 数据
   */
  data!: any;

  constructor(
    public wpx: WpxService,
    private modalRef: NzModalRef,
    private factory: FactorySerivce,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      body: [this.body, [Validators.required, this.isJSON]]
    });
  }

  /**
   * 是否为 JSON
   * @param control
   */
  isJSON = (control: AbstractControl): any => {
    if (!control.value) {
      return { required: true };
    }
    if (!validator.isJSON(control.value)) {
      return { error: true, not_json: true };
    }
    return null;
  };

  /**
   * 关闭表单
   */
  close(): void {
    this.modalRef.triggerCancel();
  }

  /**
   * 提交
   * @param data
   */
  submit(data: any): void {
    this.data = JSON.parse(data.body);
    this.modalRef.triggerOk();
  }
}