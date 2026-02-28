import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL, ALL_COMPANIES, ADD_COMPANY, UPDATE_COMPANY, ALL_COMPANIES_MINI, SINGLE_COMPANY, ENABLE_DISABLE_COMPANY } from 'src/app/endpoints';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  addCompany(data: any) {
    return this.http.post<any>(BASE_URL + ADD_COMPANY, data)
  }
  updateCompany(data: any) {
    return this.http.post<any>(BASE_URL + UPDATE_COMPANY, data)
  }
  allCompanies(data: any) {
    return this.http.post<any>(BASE_URL + ALL_COMPANIES, data)
  }
  allCompaniesMini(data: any) {
    return this.http.post<any>(BASE_URL + ALL_COMPANIES_MINI, data)
  }
  singleCompany(data: any) {
    return this.http.post<any>(BASE_URL + SINGLE_COMPANY, data)
  }
  enableDisableCompany(data: any) {
    return this.http.post<any>(BASE_URL + ENABLE_DISABLE_COMPANY, data)
  }



}
