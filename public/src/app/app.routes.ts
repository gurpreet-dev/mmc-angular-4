import { Routes } from '@angular/router';

import { SiteLayoutComponent } from './layouts/site/site-layout/site-layout.component';
import { AdminLayoutComponent } from './layouts/admin/admin-layout/admin-layout.component';
import { HomeComponent } from './home/home.component';
import { TodoListComponent } from './Todos/Components/todo-list/todo-list.component';
import { TodoFormComponent } from './Todos/Components/todo-form/todo-form.component';
import { NoContentComponent } from './no-content/no-content.component';
import { AdminLoginComponent } from './auth/admin-login/admin-login.component';
import { SubscriberLayoutComponent } from './user/roles/subscriber/subscriber-layout/subscriber-layout.component';
import { ChannelLayoutComponent } from './user/roles/channel/channel-layout/channel-layout.component';
import { ChannelFrontLayoutComponent } from './channel/channel-front-layout/channel-front-layout.component';
import { CategoryComponent } from './category/category.component';
import { VideoComponent } from './video/video.component';
import { FaqComponent } from './faq/faq.component';
import { SearchVideosComponent } from './search-videos/search-videos.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { StaticPagesComponent } from './static-pages/static-pages.component';
import { SubscriptionStatusComponent } from './subscription-status/subscription-status.component';
import { AuctionPaymentComponent } from './auction-payment/auction-payment.component';
import { AuctionPaymentStatusComponent } from './auction-payment-status/auction-payment-status.component';

import { authService } from './auth/auth.service';
import { AdminAuthService } from './auth/admin-auth.service';

export const AppRoutes: Routes = [
  { 
    path: '', 
    component: SiteLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'todos', component: TodoListComponent },
      { path: 'create', component: TodoFormComponent },
      { path: 'auth', loadChildren: './auth#AuthModule', canActivate: [authService], data: {loggedin: 'no'}},
      { path: 'live', loadChildren: './live#LiveModule' },
      { path: 'user', loadChildren: './user#UserModule', canActivate: [authService], data: {loggedin: 'yes'}},
      {
        path: 'sprofile', 
        component: SubscriberLayoutComponent,
        loadChildren: './user/roles/subscriber#SubscriberModule', canActivate: [authService], data: {loggedin: 'yes'}
      },
      {
        path: 'cprofile', 
        component: ChannelLayoutComponent,
        loadChildren: './user/roles/channel#ChannelModule', canActivate: [authService], data: {loggedin: 'yes'}
      },
      { path: 'category/:slug', component: CategoryComponent },
      { path: 'video/:id', component: VideoComponent },
      {
        path: 'channel', 
        component: ChannelFrontLayoutComponent,
        loadChildren: './channel#Channel2Module'
      },
      { path: 'search/:term', component: SearchVideosComponent },
      { path: 'faq', component: FaqComponent },
      { path: 'contact-us', component: ContactUsComponent },
      { path: 'accept/:slug', component: StaticPagesComponent },
      { path: 'subscription-status', component: SubscriptionStatusComponent },
      { path: 'auction-payment/:auctionid/:userid', component: AuctionPaymentComponent },
      { path: 'auction-payment-status', component: AuctionPaymentStatusComponent }
    ]
  },
  { 
    path: 'admin', 
    component: AdminLayoutComponent, 
    canActivate: [AdminAuthService],
    children: [
      { path: '', loadChildren: './admin/#AdminModule'}
    ]
  },
  { path: 'admin-login', component: AdminLoginComponent}
  
  
];
