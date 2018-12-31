import { Component, NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Dateago2Pipe } from '../pipes/app.dateago2';
import { ChannelRoutes } from './channel.routes';
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

import { CountDown } from "ng2-date-countdown";

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(ChannelRoutes)
  ],
  declarations: [HomeComponent, Dateago2Pipe, LiveComponent, VideosComponent, AlbumsComponent, AlbumComponent, SubscribeComponent, AuctionsComponent, AuctionPhotosComponent, AuctionVideosComponent, BidComponent, CountDown],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
})
export class Channel2Module {
  public static routes = ChannelRoutes;
}
