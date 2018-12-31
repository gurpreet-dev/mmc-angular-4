import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StaticPagesRoutes } from './static-pages.routes';
import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatTooltipModule,
} from '@angular/material';
import { CKEditorModule } from 'ng2-ckeditor';

import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(StaticPagesRoutes),
    CKEditorModule
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  declarations: [ListComponent, AddComponent, EditComponent]
})
export class StaticPagesModule {
  public static routes = StaticPagesRoutes;
}
