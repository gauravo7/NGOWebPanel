import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserDataService } from '../service/userData/user-data.service';

export const authGuard: CanActivateFn = (route, state) => {

  const userData = inject(UserDataService)
  const router = inject(Router);

  if (userData.isLogin() === false) {
    router.navigateByUrl('/login')
    return false
  }
  if (!route.data || !route.data['role']) {
    return true;
  }
  const roles = route.data['role'] as Array<string>

  if (roles) {
    const match = userData.roleMatch(roles)
    if (match) {
      return true;
    } else {
      if (userData.getData().data?.userType == 1){
        return true;
      }
      if(userData.isLogin()) {
        router.navigate(['/dashboard'])
      }
      return false;
    }
  }
  router.navigate(['/login'])
  return false;
};
