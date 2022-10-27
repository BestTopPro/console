import { NgModule } from '@angular/core';

import { ProjectsService } from '@common/projects/projects.service';
import { ShareModule } from '@common/share.module';

import { FormComponent } from './form/form.component';
import { ProjectsComponent } from './projects.component';

@NgModule({
  imports: [ShareModule],
  declarations: [ProjectsComponent, FormComponent],
  exports: [ProjectsComponent, FormComponent]
})
export class ProjectsModule {}