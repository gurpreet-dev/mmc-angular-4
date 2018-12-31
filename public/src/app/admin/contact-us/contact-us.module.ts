import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ContactUsRoutes } from './contact-us.routes';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';

import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatTooltipModule,
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(ContactUsRoutes)
  ],
  declarations: [ListComponent, EditComponent]
})
export class ContactUsModule {
  public static routes = ContactUsRoutes;
}
