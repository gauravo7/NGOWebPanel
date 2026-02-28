// angular import
import { Component, inject, output } from '@angular/core';
import { Location } from '@angular/common';

// project import
import { environment } from 'src/environments/environment';
import {SidebarLinks } from '../navigation';
import { SharedModule } from 'src/app/shared/shared.module';
import { NavGroupComponent } from './nav-group/nav-group.component';
import { UserDataService } from 'src/app/shared/service/userData/user-data.service';


@Component({
  selector: 'app-nav-content',
  imports: [SharedModule, NavGroupComponent],
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent {
  private location = inject(Location);
  title = 'Demo application for version numbering';
  currentApplicationVersion = environment.appVersion;

  navigations!: any[];
  wrapperWidth: number;
  windowWidth = window.innerWidth;
  NavCollapsedMob = output();

  finalNavbar:any = {};

  constructor(private authService:UserDataService) {
    this.navigations = SidebarLinks;
    this.filter(this.navigations);
  }

filter(navigations: any[]): void {
  const temp: any[] = [];

  navigations.forEach((obj: any) => {
    const hasPermission =
      !obj.permissions?.length ||
      this.authService.getData()?.data?.userType === 1 ||
      this.authService.roleMatch(obj.permissions);
    if (!hasPermission) return; 
    if (obj.children && obj.children.length > 0) {
      const filteredChildren = obj.children.filter((child: any) => {
        return (
          !child.permissions?.length ||
          this.authService.getData()?.data?.userType === 1 ||
          this.authService.roleMatch(child.permissions)
        );
      });

      if (filteredChildren.length > 0) {
        temp.push({
          ...obj,
          children: filteredChildren
        });
      }

    } else {
      temp.push(obj);
    }
  });

  this.navigations = [
    {
      id: 'navigation',
      title: 'Navigation',
      type: 'group',
      icon: 'icon-navigation',
      children: temp
    }
  ];
}



  fireOutClick() {
    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent.parentElement.parentElement;
      const last_parent = up_parent.parentElement;
      if (parent.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('pcoded-trigger');
        parent.classList.add('active');
      } else if (up_parent.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('pcoded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('pcoded-trigger');
        last_parent.classList.add('active');
      }
    }
  }
}
