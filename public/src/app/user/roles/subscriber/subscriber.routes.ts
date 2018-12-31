import { Routes } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { PlansComponent } from './plans/plans.component';
import { SubscriptionSuccessComponent } from './subscription-success/subscription-success.component';
import { SubscriptionCancelComponent } from './subscription-cancel/subscription-cancel.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { SubscribedChannelsComponent } from './subscribed-channels/subscribed-channels.component';
import { AuctionWinComponent } from './auction-win/auction-win.component';

export const SubscriberRoutes: Routes = [
    { path: '',      component: AboutComponent },
    { path: 'edit-profile',      component: EditProfileComponent },
    { path: 'plans',      component: PlansComponent },
    { path: 'subscription-success',      component: SubscriptionSuccessComponent },
    { path: 'subscription-cancel',      component: SubscriptionCancelComponent },
    { path: 'favorite',      component: FavoriteComponent },
    { path: 'subscribed-channels',      component: SubscribedChannelsComponent },
    { path: 'auctions',      component: AuctionWinComponent }
];
