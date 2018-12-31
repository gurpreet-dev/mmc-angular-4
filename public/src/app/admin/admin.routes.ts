import { Routes } from '@angular/router';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ApisComponent } from './apis/apis.component';

export const AdminRoutes: Routes = [
    { path: 'apis',      component: ApisComponent },
    { path: 'dashboard',      component: AdminDashboardComponent },
    { path: 'video-categories',      loadChildren: './video-category#VideoCategoryModule' },
    { path: 'video-subcategories',      loadChildren: './video-subcategory#VideoSubcategoryModule' },
    { path: 'videos',      loadChildren: './videos#VideosModule' },
    { path: 'users',      loadChildren: './users#UsersModule' },
    { path: 'plans',      loadChildren: './subscription-plans#SubscriptionPlansModule' },
    { path: 'faq',      loadChildren: './faq#FaqModule' },
    { path: 'static-pages',      loadChildren: './static-pages#StaticPagesModule' },
    { path: 'contact-us',      loadChildren: './contact-us#ContactUsModule' },
    { path: 'subscriptions',      loadChildren: './subscriptions#SubscriptionsModule' },
    { path: 'auctions',      loadChildren: './auctions#AuctionsModule' },
];
