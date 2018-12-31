import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { authService } from '../auth/auth.service';
import { Login2Component } from './login2/login2.component';

export const routes = [
    {
        path: '', 
        children: [
            { path: 'register', component: RegisterComponent },
            { path: 'login', component: LoginComponent },
            { path: 'forgot-password', component: ForgotPasswordComponent },
            { path: 'reset-password/:token', component: ResetPasswordComponent },
            { path: 'login2/:channel_id', component: Login2Component }
        ]
    },
];