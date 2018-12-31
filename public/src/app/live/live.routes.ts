import { BroadcastComponent } from './broadcast/broadcast.component';
import { ViewComponent } from './view/view.component';
import { NowComponent } from './now/now.component';

import { authService } from '../auth/auth.service';

export const routes = [
    {
        path: '', children: [
            { path: 'broadcast', component: BroadcastComponent , canActivate:[authService], data: {loggedin: 'yes'} },
            { path: 'view/:id', component: ViewComponent },
            { path: 'now', component: NowComponent }
        ]
    },
];