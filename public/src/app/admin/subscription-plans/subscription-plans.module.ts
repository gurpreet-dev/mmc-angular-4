import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { SubscriptionPlansRoutes } from './subscription-plans.routes';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(SubscriptionPlansRoutes),
  ],
  declarations: [ListComponent, AddComponent, EditComponent]
})
export class SubscriptionPlansModule {
  public static routes = SubscriptionPlansRoutes;
}
