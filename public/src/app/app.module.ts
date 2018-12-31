import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import * as $ from "jquery";
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { DataService } from './Todos/Services/data.service';
import { authService } from './auth/auth.service';
import { AdminAuthService } from './auth/admin-auth.service';
import { CommonService } from './services/common.service';
import { UserService } from './services/user.service';
import { AdminService } from './services/admin.service';
import { PaypalService } from './services/paypal.service';
import { EventsService } from './services/events.service';
import { VideoCategoryService } from './admin/video-category/video-category.service';
import { VideoSubcategoryService } from './admin/video-subcategory/video-subcategory.service';
import { StaticPagesService } from './admin/static-pages/static-pages.service';
import { SubscriptionPlansService } from './services/subscription-plans.service';
import { opentokService } from './services/opentok.service';
import { AwsService } from './services/aws.service';
import { FaqService } from './services/faq.service';
import { AuctionService } from './services/auction.service';

import { AppRoutes } from './app.routes';

import { MatInputModule, MatCardModule, MatButtonModule, MatToolbarModule, MatMenuModule, MatIconModule, MatSidenavModule } from '@angular/material';

import { HomeComponent } from './home/home.component';
import { NoContentComponent } from './no-content/no-content.component';

import { TodoFormComponent } from './Todos/Components/todo-form/todo-form.component';
import { TodoListComponent } from './Todos/Components/todo-list/todo-list.component';
import { SiteHeaderComponent } from './layouts/site/site-header/site-header.component';
import { SiteFooterComponent } from './layouts/site/site-footer/site-footer.component';
import { SiteLayoutComponent } from './layouts/site/site-layout/site-layout.component';
import { AdminHeaderComponent } from './layouts/admin/admin-header/admin-header.component';
import { AdminFooterComponent } from './layouts/admin/admin-footer/admin-footer.component';
import { AdminLayoutComponent } from './layouts/admin/admin-layout/admin-layout.component';
import { AdminLoginComponent } from './auth/admin-login/admin-login.component';
import { AdminSidebarComponent } from './layouts/admin/admin-sidebar/admin-sidebar.component';
import { SubscriberLayoutComponent } from './user/roles/subscriber/subscriber-layout/subscriber-layout.component';
import { ChannelLayoutComponent } from './user/roles/channel/channel-layout/channel-layout.component';
import { ChannelFrontLayoutComponent } from './channel/channel-front-layout/channel-front-layout.component';

import { DateagoPipe } from './pipes/app.dateago';

import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { CategoryComponent } from './category/category.component';
import { VideoComponent } from './video/video.component';
import { SearchVideosComponent } from './search-videos/search-videos.component';
import { FaqComponent } from './faq/faq.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { StaticPagesComponent } from './static-pages/static-pages.component';
import { SubscriptionStatusComponent } from './subscription-status/subscription-status.component';
import { AuctionPaymentComponent } from './auction-payment/auction-payment.component';
import { AuctionPaymentStatusComponent } from './auction-payment-status/auction-payment-status.component';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
	observer:	true,
	direction: 'horizontal',
	spaceBetween:	30,
	slidesPerView: 4,
	autoplay: {
		delay: 5000,
		disableOnInteraction: false
	},
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
};

@NgModule({
  declarations: [
    AppComponent,
    TodoFormComponent,
    TodoListComponent,
    HomeComponent,
    NoContentComponent,
    SiteHeaderComponent,
    SiteFooterComponent,
    SiteLayoutComponent,
    AdminHeaderComponent,
    AdminFooterComponent,
    AdminLayoutComponent,
    AdminLoginComponent,
    AdminSidebarComponent,
    SubscriberLayoutComponent,
    ChannelLayoutComponent,
    CategoryComponent,
    ChannelFrontLayoutComponent,
    DateagoPipe,
    VideoComponent,
    SearchVideosComponent,
    FaqComponent,
    ContactUsComponent,
    StaticPagesComponent,
    SubscriptionStatusComponent,
    AuctionPaymentComponent,
    AuctionPaymentStatusComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(AppRoutes),
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    SwiperModule,
    CommonModule
  ], 
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
  providers: [DataService, CommonService, authService, UserService, AdminAuthService, AdminService, VideoCategoryService, SubscriptionPlansService, PaypalService, AwsService, EventsService, VideoSubcategoryService, opentokService, FaqService, StaticPagesService, AuctionService, { provide: SWIPER_CONFIG,
    useValue: DEFAULT_SWIPER_CONFIG }],
  bootstrap: [AppComponent]
})

export class AppModule {};