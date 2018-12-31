import { ChangePasswordComponent } from './change-password/change-password.component';

import { authService } from '../auth/auth.service';

export const routes = [
    {
        path: '', children: [
            { path: 'change-password', component: ChangePasswordComponent}
        ]
    },
];