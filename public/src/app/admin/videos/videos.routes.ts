import { Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';

export const VideosRoutes: Routes = [
    { path: '',      component: ListComponent },
    { path: 'view/:id',      component: ViewComponent },
];
