import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AnyDto, Api } from '@weplanx/common';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';

import { Department } from './types';

@Injectable()
export class DepartmentsService extends Api<Department> {
  protected override model = 'departments';
  dict: Record<string, AnyDto<Department>> = {};

  /**
   * 获取树节点
   */
  getTreeNode(selectable = false, root: string | null = 'root'): Observable<NzTreeNodeOptions[]> {
    return this.find({}, { sort: { sort: 1 } }).pipe(
      map(v => {
        const nodes: NzTreeNodeOptions[] = [];
        const dict: Record<string, NzTreeNodeOptions> = {};
        for (const x of v) {
          this.dict[x._id] = x;
          dict[x._id] = {
            title: `${x.name}`,
            key: x._id,
            parent: x.parent ?? root,
            isLeaf: true,
            expanded: true,
            selectable: selectable
          };
        }
        for (const x of v) {
          const options = dict[x._id];
          if (!x.parent) {
            nodes.push(options);
          } else {
            const parent = x.parent ?? root;
            if (dict.hasOwnProperty(parent)) {
              if (!dict[parent].hasOwnProperty('children')) {
                dict[parent].children = [];
              }
              dict[parent].children!.push(options);
              dict[parent].isLeaf = false;
            }
          }
        }
        return nodes;
      })
    );
  }

  /**
   * 关系重组
   * @param id
   * @param parent
   */
  reorganization(id: string, parent: string): Observable<any> {
    return this.updateOneById(
      id,
      {
        $set: {
          parent: parent === 'root' ? null : parent
        }
      },
      {
        format_doc: {
          parent: 'oid'
        }
      }
    );
  }

  /**
   * 排序
   * @param sort
   */
  sort(sort: string[]): Observable<any> {
    return this.http.patch(this.url('sort'), { sort });
  }
}