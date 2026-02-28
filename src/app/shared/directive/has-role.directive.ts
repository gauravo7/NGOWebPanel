import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserDataService } from '../service/userData/user-data.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective {

  @Input()
  appHasRole!: string[];
  isVisible = false;

  constructor(private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authService: UserDataService) { }

    ngOnInit() {
      const userRoles = this.authService.getPermissions()
      if (!userRoles) {
        this.viewContainerRef.clear();
      }

      // if (this.authService.getData()?.data?.userType == 1 || this.authService.roleMatch(this.appHasRole)) {

      if (this.authService.roleMatch(this.appHasRole)) {
        if (!this.isVisible) {
          this.isVisible = true;
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        } else {
          this.isVisible = false;
          this.viewContainerRef.clear();
        }
      }
    }

}
