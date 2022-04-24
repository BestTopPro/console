import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SchemaField } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { PagesSerivce } from '../pages.serivce';
import { fieldTypeValues } from '../values';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'wpx-admin-factory-schema',
  templateUrl: './schema.component.html',
  styleUrls: ['./schema.component.scss']
})
export class SchemaComponent implements OnInit {
  fieldList: SchemaField[] = [];
  datatype: Record<string, string> = Object.fromEntries([].concat(...(fieldTypeValues.map(v => v.values) as any[])));

  constructor(
    private pages: PagesSerivce,
    private modal: NzModalService,
    private message: NzMessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.getData();
    });
  }

  getData(): void {
    this.pages.getPage().subscribe(v => {
      this.setFieldList();
    });
  }

  private setFieldList(): void {
    const fields = this.pages.page!.schema?.fields ?? {};

    this.fieldList = [
      ...Object.entries(fields)
        .map(v =>
          Object.assign(v[1], {
            key: v[0]
          })
        )
        .sort((a, b) => a.sort - b.sort)
    ];
  }

  form(doc?: SchemaField): void {
    this.modal.create({
      nzTitle: !doc ? '创建字段' : `编辑【${doc.key}】字段`,
      nzWidth: 800,
      nzContent: FormComponent,
      nzComponentParams: {
        page: this.pages.page!,
        doc
      },
      nzOnOk: () => {
        this.getData();
      }
    });
  }

  sort(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.fieldList, event.previousIndex, event.currentIndex);
    this.pages
      .sortSchemaFields(
        this.pages.id!,
        this.fieldList.map(v => v.key)
      )
      .subscribe(() => {
        this.getData();
        this.message.success('字段排序刷新成功');
      });
  }

  delete(data: SchemaField): void {
    this.modal.confirm({
      nzTitle: `您确定要删除【${data.label}】字段吗?`,
      nzOkText: '是的',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzMaskClosable: true,
      nzOnOk: () => {
        this.pages.deleteSchemaField(this.pages.id!, data.key).subscribe(() => {
          this.getData();
          this.message.success('字段删除成功');
        });
      },
      nzCancelText: '再想想'
    });
  }
}
