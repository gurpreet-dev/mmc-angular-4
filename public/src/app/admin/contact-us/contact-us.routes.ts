import { Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';

export const ContactUsRoutes: Routes = [
    { path: '',      component: ListComponent },
    { path: 'edit/:id',      component: EditComponent }
];
