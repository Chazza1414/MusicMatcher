import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; // Add this import

import { likedSongsRoute } from './liked-songs.route';
import { LikedSongsComponent } from './liked-songs.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([likedSongsRoute]), FontAwesomeModule], // Add FontAwesomeModule to the imports array
  declarations: [LikedSongsComponent],
})
export class LikedSongsModule {} // Define the LikedSongsModule separately
