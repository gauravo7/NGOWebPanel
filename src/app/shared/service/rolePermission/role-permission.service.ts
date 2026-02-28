import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ADD_ROLES, ALL_ROLES, BASE_URL, DELETE_ROLES, SINGLE_ROLE, UPDATE_ROLES } from 'src/app/endpoints';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {

  constructor(private http: HttpClient) { }

  addRole(data: any) {
    return this.http.post<any>(BASE_URL + ADD_ROLES, data)
  }

  updateRole(data: any) {
    return this.http.post<any>(BASE_URL + UPDATE_ROLES, data)
  }

  getRole(data: any) {
    return this.http.post<any>(BASE_URL + ALL_ROLES, data)
  }

  singleRole(data: any) {
    return this.http.post<any>(BASE_URL + SINGLE_ROLE, data)
  }

  deleteRole(data: any) {
    return this.http.post<any>(BASE_URL + DELETE_ROLES, data)
  }
}
