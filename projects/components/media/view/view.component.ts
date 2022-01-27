import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, Input, OnInit, Optional, TemplateRef, ViewChild } from '@angular/core';

import { AnyDto, WpxService } from '@weplanx/common';
import { Transport } from '@weplanx/components/upload';
import { NzImageService } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

import { MediaService } from '../media.service';
import { PicturesService } from '../pictures.service';
import { Media } from '../types';
import { VideosService } from '../videos.service';
import { FormComponent } from './form/form.component';
import { PictureComponent } from './picture/picture.component';
import { VideoComponent } from './video/video.component';
import { WpxMediaViewDataSource } from './view.data-source';

@Component({
  selector: 'wpx-media-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class WpxMediaViewComponent implements OnInit, AfterViewInit {
  @ViewChild('uploadRef', { static: true }) uploadRef!: TemplateRef<any>;
  @ViewChild('searchRef', { static: true }) searchRef!: TemplateRef<any>;
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
  private resizeObserver!: ResizeObserver;
  private media!: MediaService;

  @Input() wpxType!: string;
  @Input() wpxFallback!: string;
  @Input() wpxHeight?: string;

  ds!: WpxMediaViewDataSource;
  ext!: string;
  accept!: string[];
  searchText: string = '';
  labels: string[] = [];
  matchLabels: Set<string> = new Set<string>();

  constructor(
    private wpx: WpxService,
    private image: NzImageService,
    private message: NzMessageService,
    private modal: NzModalService,
    @Optional() public modalRef: NzModalRef,
    @Optional() private pictures: PicturesService,
    @Optional() private videos: VideosService
  ) {}

  ngOnInit(): void {
    switch (this.wpxType) {
      case 'pictures':
        this.media = this.pictures;
        this.ext = 'image';
        this.accept = ['image/jpeg', 'image/png', 'image/bmp', 'image/gif', 'image/webp', 'image/avif'];
        break;
      case 'videos':
        this.media = this.videos;
        this.ext = 'video';
        this.accept = ['video/mp4'];
        break;
    }
    this.ds = new WpxMediaViewDataSource(this.media);
    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        this.calculate(entry.contentRect.width);
      }
    });
    if (this.modalRef) {
      this.modalRef.afterOpen.subscribe(() => {
        this.modalRef.updateConfig({
          nzTitle: this.searchRef
        });
      });
    }
  }

  ngAfterViewInit(): void {
    this.resizeObserver.observe(this.viewport.elementRef.nativeElement);
  }

  /**
   * 获取数据
   * @param refresh
   */
  getData(refresh = false): void {
    if (this.searchText) {
      this.ds.setSearchText(this.searchText);
    }
    this.ds.fetch(refresh);
  }

  /**
   * 获取标签
   */
  getLabels(): void {
    this.pictures.findLabels().subscribe(data => {
      this.labels = [...data];
    });
  }

  /**
   * 设置标签状态
   * @param checked
   * @param data
   * @param fetch
   */
  matchLabelChange(checked: boolean, data: string, fetch = true): void {
    if (checked) {
      this.matchLabels.add(data);
    } else {
      this.matchLabels.delete(data);
    }
    if (fetch) {
      this.getData();
    }
  }

  /**
   * 设置所有标签
   * @param checked
   */
  matchLabelsChange(checked: boolean): void {
    this.labels.forEach(data => {
      this.matchLabelChange(checked, data, false);
    });
    this.getData();
  }

  /**
   * 清除筛选
   */
  clearSearch(): void {
    this.searchText = '';
    this.ds.clearSearchText();
    this.matchLabels.clear();
    this.getData(true);
  }

  /**
   * 计算每行个数
   * @param width
   * @private
   */
  private calculate(width: number): void {
    const n = width >= 1600 ? 6 : 4;
    if (this.ds.n !== n) {
      this.ds.n = n;
      this.ds.pageSize = n * 3;
      this.getData(true);
    }
  }

  /**
   * 关闭对话框
   */
  close(): void {
    this.modalRef.triggerCancel();
  }

  /**
   * 确认对话框
   */
  submit(): void {
    this.modalRef.triggerOk();
  }

  /**
   * 查看图片
   * @param data
   */
  previewPicture(data: AnyDto<Media>): void {
    const url = new URL(`${this.wpx.assets}/${data.url}`);
    if (data.params) {
      for (const [name, value] of Object.entries(data.params)) {
        url.searchParams.append(name, value);
      }
    }
    this.image.preview([
      {
        src: url.toString(),
        alt: data.name
      }
    ]);
  }

  /**
   * 查看视频封面
   * @param data
   */
  previewPoster(data: AnyDto<Media>): void {
    this.image.preview(
      [0, 1, 2].map(n => ({
        src: `${this.wpx.assets}/${data.url}_${n}.jpg`
      }))
    );
  }

  /**
   * 编辑
   * @param editable
   */
  form(editable: AnyDto<Media>): void {
    this.modal.create({
      nzTitle: '编辑',
      nzContent: FormComponent,
      nzComponentParams: {
        editable,
        media: this.media
      }
    });
  }

  /**
   * 设置图片
   * @param data
   */
  picture(data: AnyDto<Media>): void {
    this.modal.create({
      nzTitle: '图片设置',
      nzWidth: 960,
      nzContent: PictureComponent,
      nzComponentParams: {
        data
      }
    });
  }

  /**
   * 查看视频
   * @param data
   */
  video(data: AnyDto<Media>): void {
    this.modal.create({
      nzTitle: data.name,
      nzWidth: 960,
      nzContent: VideoComponent,
      nzComponentParams: {
        data
      },
      nzFooter: null
    });
  }

  /**
   * 上传
   * @param data
   */
  upload(data: Transport[]): void {
    const docs: Media[] = data.map(v => ({
      name: v.name,
      url: Reflect.get(v.file.originFileObj!, 'key')
    }));
    this.media.create({ docs }).subscribe(v => {
      this.getData(true);
    });
  }

  /**
   * 批量取消
   */
  bulkUnchecked(): void {
    this.ds.checkedIds.clear();
    this.ds.updateCheckedStatus();
  }

  /**
   * 删除
   * @param data
   */
  delete(data: AnyDto<Media>): void {
    this.media.delete(data._id).subscribe(() => {
      this.message.success('数据删除完成');
      this.ds.fetch(true);
    });
  }

  /**
   * 批量删除
   */
  bulkDelete(): void {
    this.modal.confirm({
      nzTitle: '您确认要删除这些文件吗?',
      nzOkText: '是的',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.media.bulkDelete([...this.ds.checkedIds.values()]).subscribe(() => {
          this.ds.checkedIds.clear();
          this.ds.updateCheckedStatus();
          this.ds.fetch(true);
          this.message.success('数据删除完成');
        });
      },
      nzCancelText: '否'
    });
  }
}
