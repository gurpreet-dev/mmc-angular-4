import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgCircleProgressModule } from 'ng-circle-progress';
import { ProgressBarModule } from "angular-progress-bar";
import {CalendarModule} from 'primeng/calendar';

import { ChannelRoutes } from './channel.routes';

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
import { TimeAgoPipe } from 'time-ago-pipe';
import { AgePipe } from '../../../pipes/app.age';
import { SubscriptionPlansComponent } from './subscription-plans/subscription-plans.component';
import { AuctionsComponent } from './auctions/auctions.component';
import { AuctionUploadImageComponent } from './auction-upload-image/auction-upload-image.component';
import { AuctionUploadVideoComponent } from './auction-upload-video/auction-upload-video.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(ChannelRoutes),
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300
    }),
    ProgressBarModule,
    CalendarModule
    
  ],
  declarations: [AboutComponent, EditProfileComponent, AlbumsComponent, CreateAlbumComponent, UploadPhotosComponent, AlbumComponent, VideosComponent, UploadVideosComponent, PaymentsTabComponent, LiveBroadcastComponent, TimeAgoPipe, AgePipe, SubscriptionPlansComponent, AuctionsComponent, AuctionUploadImageComponent, AuctionUploadVideoComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ChannelModule {
  public static routes = ChannelRoutes;
}
