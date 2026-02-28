import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ADD_PROFILE, ADD_USERS, ALL_COMPANY_DISTRIBUTORS, ALL_COMPANY_DISTRIBUTORS_MINI, ALL_CUSTOMERS, ALL_DISTRIBUTORS, ALL_REGISTERED_CUSTOMERS, ALL_USERS, BASE_URL, CHANGE_DISTRIBUTOR_TYPE, COMPANY_ADD_EXISTING_DISTRIBUTOR, COMPANY_CUSTOMERS, COMPANY_DISTRIBUTOR_SEARCH, DASHBOARD, DISTRIBUTOR_SEARCH, ENABLE_DISABLE_DISTRIBUTOR, ENABLE_DISABLE_USERS, FORGOT_PASSWORD, IS_ADDED, IS_ADMIN, IS_LOGIN, LOGIN, NO_ASSIGN_RTL_TO_DISTRIBUTOR, NOT_ASSIGNED_DIS_ALL, PROFILE, REGISTER_DISTRIBUTOR, RTL_UNDER_WHL, RTL_UNDER_WHL_ADD, RTL_UNDER_WHL_REMOVE, RTL_UNDER_WHL_UPDATE, SEND_OTP, SINGLE_CUSTOMER, SINGLE_DISTRIBUTOR, SINGLE_USERS, SWITCH_DISTRIBUTOR, UPDATE_DISTRIBUTOR, UPDATE_PROFILE, UPDATE_USERS, USER_DATA, VERIFY_OTP } from 'src/app/endpoints';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private http: HttpClient) { }

  setData(data: any) {
    const jsonData = JSON.stringify(data)
    const permissionsArray = data?.data?.roleId?.permissions.join()
    localStorage.setItem(IS_ADDED, data.data.isSchoolAdded.toString())
    localStorage.setItem(USER_DATA, jsonData)
    localStorage.setItem(IS_LOGIN, "true")
    localStorage.setItem(IS_ADMIN, data?.data?.is_school_admin.toString())
    localStorage.setItem('permission', permissionsArray)
    //console.log(permissionsArray,data?.data?.is_school_admin.toString())
  }

  setSession(data: any) {
    localStorage.setItem('session_id', data)
  }

  getSession() {
    return localStorage.getItem('session_id')
  }

  setStudentsInLocal(data: any) {
    localStorage.setItem('students', JSON.stringify(data))
  }

  getStudentsFromLocal() {
    return localStorage.getItem('students')
  }

  getData() {
    const obj: any = JSON.parse(localStorage.getItem(USER_DATA) ?? "{}")
    return obj
  }
  isLogin() {
    return localStorage.getItem(IS_LOGIN) == "true"
  }
  isAdded() {
    return localStorage.getItem(IS_ADDED) == "true"
  }
  isAdmin() {
    return localStorage.getItem(IS_ADMIN) == "true"
  }
  setIsAdded(status: string) {
    return localStorage.setItem(IS_ADDED, status)
  }
  removeData(key: string) {
    localStorage.removeItem(key)
  }
  clearData() {
    localStorage.clear()
  }
  getProfile() {
    return this.http.post<any>(BASE_URL + PROFILE, {})
  }

  addProfile(data: any, type: boolean) {
    if (!type) {
      return this.http.post<any>(BASE_URL + ADD_PROFILE, data)
    } else {
      return this.http.post<any>(BASE_URL + UPDATE_PROFILE, data)
    }
  }

  /**
   * Dashboard
   */
  getDashboard(data: any) {
    return this.http.post<any>(BASE_URL + DASHBOARD, data)
  }

  registerDistributor(data: any) {
    return this.http.post<any>(BASE_URL + REGISTER_DISTRIBUTOR, data)
  }

  updateDistributor(data: any) {
    return this.http.post<any>(BASE_URL + UPDATE_DISTRIBUTOR, data)
  }


  switchDistributor(data: any) {
    return this.http.post<any>(BASE_URL + SWITCH_DISTRIBUTOR, data)
  }

  registerExistingDistributor(data: any) {
    return this.http.post<any>(BASE_URL + COMPANY_ADD_EXISTING_DISTRIBUTOR, data)
  }

  allCompanyDistributor(data: any) {
    return this.http.post<any>(BASE_URL + ALL_COMPANY_DISTRIBUTORS, data)
  }

  allCompanyDistributorMini(data: any) {
    return this.http.post<any>(BASE_URL + ALL_COMPANY_DISTRIBUTORS_MINI, data)
  }


  allDistributor(data: any) {
    return this.http.post<any>(BASE_URL + ALL_DISTRIBUTORS, data)
  }


  allDistributorMini(data: any) {
    return this.http.post<any>(BASE_URL + NOT_ASSIGNED_DIS_ALL, data)
  }

  distributorSearch(data: any) {
    return this.http.post<any>(BASE_URL + DISTRIBUTOR_SEARCH, data)
  }

  companyDistributorSearch(data: any) {
    return this.http.post<any>(BASE_URL + COMPANY_DISTRIBUTOR_SEARCH, data)
  }



  singleDistributor(data: any) {
    return this.http.post<any>(BASE_URL + SINGLE_DISTRIBUTOR, data)
  }
  singleCustomer(data: any) {
    return this.http.post<any>(BASE_URL + SINGLE_CUSTOMER, data)
  }
  companyCustomers(data: any) {
    return this.http.post<any>(BASE_URL + COMPANY_CUSTOMERS, data)
  }

  rtlUnderWhl(data: any) {
    return this.http.post<any>(BASE_URL + RTL_UNDER_WHL, data)
  }

  rtlUnderWhlAdd(data: any) {
    return this.http.post<any>(BASE_URL + RTL_UNDER_WHL_ADD, data)
  }

  rtlUnderWhlUpdate(data: any) {
    return this.http.post<any>(BASE_URL + RTL_UNDER_WHL_UPDATE, data)
  }

  rtlUnderWhlRemove(data: any) {
    return this.http.post<any>(BASE_URL + RTL_UNDER_WHL_REMOVE, data)
  }

  changeDistributorType(data: any) {
    return this.http.post<any>(BASE_URL + CHANGE_DISTRIBUTOR_TYPE, data)
  }

  noAssignRetailersToDis(data: any) {
    return this.http.post<any>(BASE_URL + NO_ASSIGN_RTL_TO_DISTRIBUTOR, data)
  }

  login(data: any) {
    return this.http.post<any>(BASE_URL + LOGIN, data)
  }


  getAllUsers(data: any) {
    return this.http.post<any>(BASE_URL + ALL_USERS, data)
  }
  getAllCUSTOMERS(data: any) {
    return this.http.post<any>(BASE_URL + ALL_CUSTOMERS, data)
  }

  getAllRegisteredCustomers(data: any) {
    return this.http.post<any>(BASE_URL + ALL_REGISTERED_CUSTOMERS, data)
  }

  singleUser(data: any) {
    return this.http.post<any>(BASE_URL + SINGLE_USERS, data)
  }

  addUser(data: any) {
    return this.http.post<any>(BASE_URL + ADD_USERS, data)
  }

  updateUsers(data: any) {
    return this.http.post<any>(BASE_URL + UPDATE_USERS, data)
  }

  enableDisableUser(data: any) {
    return this.http.post<any>(BASE_URL + ENABLE_DISABLE_USERS, data)
  }
  enableDisableDistributor(data: any) {
    return this.http.post<any>(BASE_URL + ENABLE_DISABLE_DISTRIBUTOR, data)
  }

  /**
   * Roles and permission data
   */
  public getPermissions() {
    return localStorage.getItem("permission")
    //return "['Category','Subcategory','User','Products',]"
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

  requestOTP(data: any) {
    return this.http.post<any>(BASE_URL + SEND_OTP, data)
  }
  verifyOTP(data: any) {
    return this.http.post<any>(BASE_URL + VERIFY_OTP, data)
  }

  forgotPassword(data: any) {
    return this.http.post<any>(BASE_URL + FORGOT_PASSWORD, data);
  }



}
