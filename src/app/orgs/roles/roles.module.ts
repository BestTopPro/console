import { NgModule } from '@angular/core';

import { ShareModule } from '@common/share.module';
import { WpxModule } from '@weplanx/ng';
import { WpxTableModule } from '@weplanx/ng/table';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { NzTreeModule } from 'ng-zorro-antd/tree';

import { FormComponent } from './form/form.component';
import { RolesComponent } from './roles.component';
import { RolesService } from './roles.service';

@NgModule({
  imports: [WpxModule, ShareModule, WpxTableModule, NzTransferModule, NzTreeModule],
  declarations: [RolesComponent, FormComponent],
  providers: [RolesService]
})
export class RolesModule {}