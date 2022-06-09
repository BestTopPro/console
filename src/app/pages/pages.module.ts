import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ShareModule } from '@common/share.module';
import { WpxHeaderModule, WpxNavModule, WpxDynamicComponent, WpxDynamicModule } from '@weplanx/ng-intgr';

import { EmptyComponent } from './empty/empty.component';
import { PagesActivated } from './pages.activated';
import { PagesComponent } from './pages.component';
import { WriteOffModule } from './write-off/write-off.module';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivateChild: [PagesActivated],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: ':pageId',
        component: WpxDynamicComponent
      },
      { path: '', redirectTo: '/pages/dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [
    ShareModule,
    WpxHeaderModule,
    WpxNavModule,
    WpxDynamicModule,
    RouterModule.forChild(routes),
    WriteOffModule
  ],
  declarations: [PagesComponent, EmptyComponent],
  providers: [PagesActivated]
})
export class PagesModule {}
