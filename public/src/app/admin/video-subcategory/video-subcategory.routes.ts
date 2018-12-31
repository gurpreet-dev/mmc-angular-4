import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { VideosComponent } from './videos/videos.component';

export const VideoSubcategoryRoutes: Routes = [
    { path: '',      component: ListComponent },
    { path: 'add',      component: AddComponent },
    { path: 'edit/:id',      component: EditComponent },
    { path: 'videos/:id',      component: VideosComponent }
];
