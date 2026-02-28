import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ADD_CATEGORY, ALL_CATEGORIES, ALL_CATEGORY_MINI, BASE_URL, DASHBOARD, ENABLE_DISABLE_CATEGORY, SINGLE_CATEGORY, UPDATE_CATEGORY } from 'src/app/endpoints';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  addCategory(data: any) {
    return this.http.post<any>(BASE_URL + ADD_CATEGORY, data)
  }
  updateCategory(data: any) {
    return this.http.post<any>(BASE_URL + UPDATE_CATEGORY, data)
  }
  allCategories(data: any) {
    return this.http.post<any>(BASE_URL + ALL_CATEGORIES, data)
  }
  allCategoriesMini(data: any) {
    return this.http.post<any>(BASE_URL + ALL_CATEGORY_MINI, data)
  }
  singleCategory(data: any) {
    return this.http.post<any>(BASE_URL + SINGLE_CATEGORY, data)
  }
  enableDisableCategory(data: any) {
    return this.http.post<any>(BASE_URL + ENABLE_DISABLE_CATEGORY, data)
  }


}
