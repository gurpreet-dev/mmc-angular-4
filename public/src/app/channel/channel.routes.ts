import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LiveComponent } from './live/live.component';
import { VideosComponent } from './videos/videos.component';
import { AlbumsComponent } from './albums/albums.component';
import { AlbumComponent } from './album/album.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { AuctionsComponent } from './auctions/auctions.component';
import { AuctionPhotosComponent } from './auction-photos/auction-photos.component';
import { AuctionVideosComponent } from './auction-videos/auction-videos.component';
import { BidComponent } from './bid/bid.component';

import { authService } from '../auth/auth.service';

export const ChannelRoutes: Routes = [
    { path: 'view/:id',      component: HomeComponent },
    { path: 'live/:id',      component: LiveComponent },
    { path: 'videos/:id',      component: VideosComponent },
    { path: 'albums/:id',      component: AlbumsComponent },
    { path: 'album/:id/:albumid',      component: AlbumComponent },
    { path: 'subscribe/:id',      component: SubscribeComponent, canActivate: [authService], data: {loggedin: 'yes'} },
    { path: 'auctions/:id',      component: AuctionsComponent, canActivate: [authService], data: {loggedin: 'yes'} },
    { path: 'auction-photos/:id',      component: AuctionPhotosComponent, canActivate: [authService], data: {loggedin: 'yes'} },
    { path: 'auction-videos/:id',      component: AuctionVideosComponent, canActivate: [authService], data: {loggedin: 'yes'} },
    { path: 'bid/:id/:auctionid',      component: BidComponent },
];
