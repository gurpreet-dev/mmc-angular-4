import { Injectable } from '@angular/core';  
import { CanActivate, ActivatedRouteSnapshot, Router, CanActivateChild } from '@angular/router';
import * as jwt_decode from "jwt-decode";

@Injectable()
export class AuthRoleService implements CanActivate {  

    userinfo : any;

    constructor( private router: Router) {}

    isLoggedin() {
        if(localStorage.getItem('jwtToken')  === null){
            return false;
        }else{
            return true;
        }
    }

    loginCheck(){
        if(localStorage.getItem('jwtToken') === null){
            this.router.navigate(['/admin-login']);
            return false;
        }else{;
            this.userinfo = jwt_decode(localStorage.getItem('jwtToken'));
                if(this.userinfo.role == 'admin'){
                    return true;
                }else{
                    this.router.navigate(['/admin-login']);
                    return false;
                }
        }
    }

    canActivate(route: ActivatedRouteSnapshot) {

        return this.loginCheck();
    }

    logout(){
        localStorage.removeItem('jwtToken');
        window.location.href = '/auth/login';
    }

} 