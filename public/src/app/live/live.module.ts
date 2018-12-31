import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule }  from '@angular/http';
import { 
  MatCardModule,
  MatListModule,
  MatInputModule,
  MatButtonModule,
  MatSnackBarModule
 } from '@angular/material';

import { routes } from './live.routes';
import { BroadcastComponent } from './broadcast/broadcast.component';
import { ViewComponent } from './view/view.component';
import { NowComponent } from './now/now.component';

@NgModule({
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    BroadcastComponent,
    ViewComponent,
    NowComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    RouterModule,
    HttpModule,
    MatCardModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
    // ApolloModule.forRoot(client)
  ],
})
export class LiveModule {
  public static routes = routes;
}
