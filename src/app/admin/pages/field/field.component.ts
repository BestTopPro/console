import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { Page } from '../dto/page';
import { PagesSerivce } from '../pages.serivce';
import { fieldTypeValues } from '../values';

@Component({
  selector: 'app-admin-pages-field',
  templateUrl: './field.component.html'
})
export class FieldComponent implements OnInit {
  @Input() editable?: Record<string, any>;
  @Input() page?: Page;
  form?: FormGroup;
  typeValues: Array<Record<string, any>> = fieldTypeValues;
  readonly special = ['number', 'radio', 'checkbox', 'select'];

  constructor(
    private modal: NzModalRef,
    private pages: PagesSerivce,
    private fb: FormBuilder,
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      key: [null, [Validators.required, Validators.pattern(/^[a-z_]+$/), this.existsField]],
      label: [null, [Validators.required]],
      type: [null, [Validators.required]],
      description: [null],
      placeholder: [null],
      default: [null],
      required: [false],
      unique: [false],
      hide: [false],
      modified: [true],
      spec: this.fb.group({
        max: [null],
        min: [null],
        decimal: [null],
        values: this.fb.array([]),
        reference: [null],
        target: [null],
        multiple: [false]
      })
    });
  }

  existsField = (control: AbstractControl) => {
    if (this.page?.schema?.fields.hasOwnProperty(control.value)) {
      return { error: true, duplicated: true };
    }
    return null;
  };

  get specValues(): FormArray {
    return this.form?.get('spec')?.get('values') as FormArray;
  }

  addValues(): void {
    this.specValues.push(
      this.fb.group({
        label: [null, [Validators.required]],
        value: [null, [Validators.required]]
      })
    );
  }

  removeEnum(index: number): void {
    this.specValues.removeAt(index);
  }

  close(): void {
    this.modal.triggerCancel();
  }

  submit(data: any): void {
    const key = data.key;
    delete data.key;
    this.pages.updateSchemaField(this.page!._id, key, data).subscribe(v => {
      if (!v.code) {
        this.message.success('数据新增完成');
        this.modal.triggerOk();
      } else {
        this.notification.error('操作失败', v.message);
      }
    });
  }
}
