import { Component, OnInit } from '@angular/core';
import { authService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [authService]
})
export class AppComponent {
  title = 'Angular 4 Mean Starter Kit';
  isLogged;
  constructor(public authService: authService) {}

  public ngOnInit() {

    this.isLogged = this.authService.isLoggedin();

  }

  logout(){
    this.authService.logout();
  }

  redirect(url){
      window.location.href = url;
  }

}
