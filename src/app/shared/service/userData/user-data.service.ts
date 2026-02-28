import { Injectable } from '@angular/core';
import { USER_DATA, IS_LOGIN } from '../../../endpoints';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  
  constructor() { }

  setData(data: any) {
    const jsonData = JSON.stringify(data)
    sessionStorage.setItem(USER_DATA, jsonData)
    sessionStorage.setItem(IS_LOGIN, "true")
  }

  getData() {
    const obj: any = JSON.parse(sessionStorage.getItem(USER_DATA) ?? "")
    return obj
  }

  getDataWithKey(key: string) {
    return sessionStorage.getItem(key)
  }

  isLogin() {
    return sessionStorage.getItem(IS_LOGIN) === "true"
  }

  clearData() {
    sessionStorage.clear()
  }

  /**
 * Roles and permission data
 */
  public getPermissions() {
    const obj: any = JSON.parse(sessionStorage.getItem(USER_DATA) ?? "{}")
    return obj?.data?.role?.permissions
  }

  public roleMatch(allowedRoles: any): boolean {
    let isMatch = false;
    const userRoles = this.getPermissions()

    allowedRoles.forEach((element: any) => {
      if (userRoles?.includes(element)) {
        isMatch = true;
        return;
      }
    });
    return isMatch;
  }
  
}
