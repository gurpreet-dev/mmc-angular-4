import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { userRoutes } from './users.routes';

import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { ViewComponent } from './view/view.component';
import { AlbumComponent } from './album/album.component';
import { AlbumsComponent } from './albums/albums.component';
import { VideosComponent } from './videos/videos.component';
import { EditComponent } from './edit/edit.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(userRoutes),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ListComponent,
    AddComponent,
    ViewComponent,
    AlbumComponent,
    AlbumsComponent,
    VideosComponent,
    EditComponent,
    ChangePasswordComponent
  ]
})
export class UsersModule {
  public static routes = userRoutes;
}
