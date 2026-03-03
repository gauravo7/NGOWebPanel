import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL, ALL_SAMPLES, ADD_SAMPLE, SINGLE_SAMPLE, UPDATE_SAMPLE, ENABLE_DISABLE_SAMPLE, GET_CITIES, GET_STATES, ALL_ISSUED_SAMPLE, ISSUED_SAMPLE_ADD, ALL_ISSUED_SAMPLE_DISTRIBUTOR, ALL_ISSUED_SAMPLE_TO_CUSTOMER, SELECT_SINGLE_SAMPLE_FOR_ISSUE, ISSUED_MULTIPLE_SAMPLE_TO_DIS, CHECK_MULTIPLE_SAMPLE_BEFORE_ISSUE, ALL_ISSUED_SAMPLE_DISTRIBUTOR_TRANSACTION, ADD_TREATMENT, ADD_CATEGORY_LOGS, ADD_WARD_LOGS, ADD_DISCHARGE, ALL_WARD_LOGS, ALL_CATEGORY_LOGS, ALL_TREATMENT, BULK_ADD_PEOPLE, SCAN_PEOPLE, MISSING_ALL } from 'src/app/endpoints';

@Injectable({
  providedIn: 'root'
})
export class SampleService {

  constructor(private http: HttpClient) { }


  allSamples(data: any) {
    return this.http.post<any>(BASE_URL + ALL_SAMPLES, data)
  }

  allIssuedSamples(data: any) {
    return this.http.post<any>(BASE_URL + ALL_ISSUED_SAMPLE, data)
  }

  allIssuedSamplesDistributor(data: any) {
    return this.http.post<any>(BASE_URL + ALL_ISSUED_SAMPLE_DISTRIBUTOR, data)
  }

  allIssuedSamplesDistributorTransaction(data: any) {
    return this.http.post<any>(BASE_URL + ALL_ISSUED_SAMPLE_DISTRIBUTOR_TRANSACTION, data)
  }

  allIssuedSamplesToCustomer(data: any) {
    return this.http.post<any>(BASE_URL + ALL_ISSUED_SAMPLE_TO_CUSTOMER, data)
  }

  issueSample(data: any) {
    return this.http.post<any>(BASE_URL + ISSUED_SAMPLE_ADD, data)
  }

  addSample(data: any) {
    return this.http.post<any>(BASE_URL + ADD_SAMPLE, data)
  }

  singleSample(data: any) {
    return this.http.post<any>(BASE_URL + SINGLE_SAMPLE, data)
  }

  updateSample(data: any) {
    return this.http.post<any>(BASE_URL + UPDATE_SAMPLE, data)
  }

  enableDisableSample(data: any) {
    return this.http.post<any>(BASE_URL + ENABLE_DISABLE_SAMPLE, data)
  }

  getCities(data: any) {
    return this.http.post<any>(BASE_URL + GET_CITIES, data)
  }

  getStates(data: any) {
    return this.http.post<any>(BASE_URL + GET_STATES, data)
  }


  selectSampleForIssue(data: any) {
    return this.http.post<any>(BASE_URL + SELECT_SINGLE_SAMPLE_FOR_ISSUE, data)
  }


  issuedMultipleSampleToDis(data: any) {
    return this.http.post<any>(BASE_URL + ISSUED_MULTIPLE_SAMPLE_TO_DIS, data)
  }
  checkMultipleSampleBeforeIssue(data: any) {
    return this.http.post<any>(BASE_URL + CHECK_MULTIPLE_SAMPLE_BEFORE_ISSUE, data)
  }


  addTreatment(data:any) {
    return this.http.post<any>(BASE_URL+ADD_TREATMENT,data);
  }

  addCategoryLogs(data:any) {
    return this.http.post<any>(BASE_URL+ADD_CATEGORY_LOGS,data);
  }

  addWardLogs(data:any) {
    return this.http.post<any>(BASE_URL+ADD_WARD_LOGS,data);
  }


  addDischage(data:any) {
    return this.http.post<any>(BASE_URL+ADD_DISCHARGE,data);
  }

  getTreatment(data:any) {
    return this.http.post<any>(BASE_URL+ALL_TREATMENT,data);
  }

  getCategoryLogs(data:any) {
    return this.http.post<any>(BASE_URL+ALL_CATEGORY_LOGS,data);
  }

  getWardLogs(data:any) {
    return this.http.post<any>(BASE_URL+ALL_WARD_LOGS,data);
  }


  addBulkMember(data:any) {
    return this.http.post<any>(BASE_URL+BULK_ADD_PEOPLE,data);
  }



  scanPerson(data:any) {
    return this.http.post<any>(BASE_URL+SCAN_PEOPLE,data);
  }

 
  allMembers(data:any) {
    return this.http.post<any>(BASE_URL+MISSING_ALL,data);
  }







}
