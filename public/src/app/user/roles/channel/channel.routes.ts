import { Routes } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AlbumsComponent } from './albums/albums.component';
import { CreateAlbumComponent } from './create-album/create-album.component';
import { UploadPhotosComponent } from './upload-photos/upload-photos.component';
import { AlbumComponent } from './album/album.component';
import { VideosComponent } from './videos/videos.component';
import { UploadVideosComponent } from './upload-videos/upload-videos.component';
import { PaymentsTabComponent } from './payments-tab/payments-tab.component';
import { LiveBroadcastComponent } from './live-broadcast/live-broadcast.component';
import { SubscriptionPlansComponent } from './subscription-plans/subscription-plans.component';
import { AuctionsComponent } from './auctions/auctions.component';
import { AuctionUploadImageComponent } from './auction-upload-image/auction-upload-image.component';
import { AuctionUploadVideoComponent } from './auction-upload-video/auction-upload-video.component';

export const ChannelRoutes: Routes = [
    { path: '',      component: AboutComponent },
    { path: 'edit-profile',      component: EditProfileComponent },
    { path: 'albums',      component: AlbumsComponent },
    { path: 'create-album',      component: CreateAlbumComponent },
    { path: 'upload-photos',      component: UploadPhotosComponent },
    { path: 'album/:id',      component: AlbumComponent },
    { path: 'videos',      component: VideosComponent},
    { path: 'upload-video',      component: UploadVideosComponent },
    { path: 'payment',      component: PaymentsTabComponent },
    { path: 'live-broadcast',      component: LiveBroadcastComponent },
    { path: 'subscription-plans',      component: SubscriptionPlansComponent },
    { path: 'auctions',      component: AuctionsComponent },
    { path: 'auction-upload-image',      component: AuctionUploadImageComponent },
    { path: 'auction-upload-video',      component: AuctionUploadVideoComponent }
];
