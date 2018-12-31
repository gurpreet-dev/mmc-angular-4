import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { subscriptionsRoutes } from './subscriptions.routes';

import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(subscriptionsRoutes),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ListComponent, ViewComponent]
})
export class SubscriptionsModule {
  public static routes = subscriptionsRoutes;
}
