import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { VideoSubcategoryRoutes } from './video-subcategory.routes';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { VideosComponent } from './videos/videos.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(VideoSubcategoryRoutes),
  ],
  declarations: [ListComponent, AddComponent, EditComponent, VideosComponent]
})
export class VideoSubcategoryModule {
  public static routes = VideoSubcategoryRoutes;
}
