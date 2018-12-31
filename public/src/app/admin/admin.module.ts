import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminRoutes } from './admin.routes';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatTooltipModule,
} from '@angular/material';

import { ApisComponent } from './apis/apis.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(AdminRoutes),
  ],
  declarations: [
    AdminDashboardComponent,
    ApisComponent
  ]
})
export class AdminModule {
  public static routes = AdminRoutes;
}
