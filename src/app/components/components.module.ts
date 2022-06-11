import { NgModule } from '@angular/core';

import { ShareModule } from '@common/share.module';
import { WpxService } from '@weplanx/ng';

import { CustomizeComponent } from './customize.component';

@NgModule({
  imports: [ShareModule],
  declarations: [CustomizeComponent]
})
export class ComponentsModule {
  constructor(wpx: WpxService) {
    console.log(wpx);
    wpx.setComponent('customize', '自制', CustomizeComponent);
  }
}
