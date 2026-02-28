// angular import
import { Component, OnDestroy, OnInit } from '@angular/core';

// project import
import { SharedModule } from 'src/app/shared/shared.module';
import { NavSearchComponent } from './nav-search/nav-search.component';

//
import screenfull from 'screenfull';
import { UserDataService } from 'src/app/shared/service/userData/user-data.service';

@Component({
  selector: 'app-nav-left',
  imports: [SharedModule],
  templateUrl: './nav-left.component.html',
  styleUrls: ['./nav-left.component.scss']
})
export class NavLeftComponent implements OnInit, OnDestroy {
  screenFull = true;
  userData: any

  constructor (private _userData: UserDataService,){
    
  }
  // life cycle hook
  ngOnInit() {
        this.userData = this._userData.getData()
    if (screenfull.isEnabled) {
      this.screenFull = screenfull.isFullscreen; // Initialize based on current fullscreen state
      screenfull.on('change', () => {
        this.screenFull = screenfull.isFullscreen;
      });
    }
  }

  ngOnDestroy() {
    if (screenfull.isEnabled) {
      screenfull.off('change', () => {
        this.screenFull = screenfull.isFullscreen;
      });
    }
  }

  toggleFullscreen() {
    if (screenfull.isEnabled) {
      screenfull.toggle().then(() => {
        this.screenFull = screenfull.isFullscreen;
      });
    }
  }
}
