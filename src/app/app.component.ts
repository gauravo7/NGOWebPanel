// Angular import
import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NgxSpinnerComponent } from 'ngx-spinner';

// project import


@Component({
  selector: 'app-root',
  imports: [RouterModule,NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private router = inject(Router);

  title = 'datta-able';

  // life cycle hook
  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
