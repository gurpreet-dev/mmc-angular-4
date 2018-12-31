import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SubscriberRoutes } from './subscriber.routes';

import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Dateago3Pipe } from '../../../pipes/app.dateago3';

import { AboutComponent } from './about/about.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { PlansComponent } from './plans/plans.component';
import { SubscriptionSuccessComponent } from './subscription-success/subscription-success.component';
import { SubscriptionCancelComponent } from './subscription-cancel/subscription-cancel.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { SubscribedChannelsComponent } from './subscribed-channels/subscribed-channels.component';
import { AuctionWinComponent } from './auction-win/auction-win.component';

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
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(SubscriberRoutes),
    SwiperModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
  declarations: [AboutComponent, EditProfileComponent, PlansComponent, SubscriptionSuccessComponent, SubscriptionCancelComponent, FavoriteComponent, Dateago3Pipe, SubscribedChannelsComponent, AuctionWinComponent],
  providers: [ { provide: SWIPER_CONFIG,
    useValue: DEFAULT_SWIPER_CONFIG }],
})
export class SubscriberModule {
  public static routes = SubscriberRoutes;
}
