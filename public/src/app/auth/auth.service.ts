import { Injectable } from '@angular/core';  
import { CanActivate, ActivatedRouteSnapshot, Router, CanActivateChild } from '@angular/router';
import * as jwt_decode from "jwt-decode";

@Injectable()
export class authService implements CanActivate, CanActivateChild {  

    userinfo : any;

    constructor( private router: Router) {}

    isLoggedin() {
        if(localStorage.getItem('jwtToken')  === null){
            return false;
        }else{
            return true;
        }
    }

    loginCheck(loggedin){

        if(loggedin == 'yes'){
            if(localStorage.getItem('jwtToken') === null){
                this.router.navigate(['/']);
                return false;
            }else{

                this.userinfo = jwt_decode(localStorage.getItem('jwtToken'));

                if(this.userinfo.role == 'channel' || this.userinfo.role == 'subscriber'){
                    return true;
                }else{
                    return false;
                }
            }
        }else{
            if(localStorage.getItem('jwtToken') === null){
                return true;
            }else{
                this.router.navigate(['/']);
                return false;
            }
        }
        
    }

    canActivate(route: ActivatedRouteSnapshot) {
        
        let loggedin_required = route.data["loggedin"];
        
        return this.loginCheck(loggedin_required);
    }

    canActivateChild(route: ActivatedRouteSnapshot){
        let loggedin_required = route.data["loggedin"];

        return this.loginCheck(loggedin_required);
    }

    logout(){
        localStorage.removeItem('jwtToken');
        window.location.href = '/auth/login';
    }

    admin_logout(){
        localStorage.removeItem('jwtToken');
        window.location.href = '/';
    }

} 