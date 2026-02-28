import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL, ALL_SAMPLES, DASHBOARD, COMPANY_DASHBOARD } from 'src/app/endpoints';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }


  adminDashboard(data: any) {
    return this.http.post<any>(BASE_URL + DASHBOARD, data)
  }

  
  companyDashboard(data: any) {
    return this.http.post<any>(BASE_URL + COMPANY_DASHBOARD, data)
  }





}
