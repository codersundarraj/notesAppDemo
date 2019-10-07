import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from "rxjs";
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { DataModel } from 'src/app/model/data-model';

const httpOptions = {
  // headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, PUT, GET, OPTIONS'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

    constructor(private http: HttpClient) { }

    getFolderDetails(): Observable<DataModel> {
      var URL = environment.serverURI + 'data'
      return this.http.get<DataModel>(URL).pipe(
        map(res => {
          return res;
        })
      );
    }

    //add file
    addData(payload: object): Observable<DataModel> {
      return this.http.post<DataModel>(environment.serverURI + 'data', payload, httpOptions).pipe(
        map(res => {
          return res;
        })
      );
    }

    updateData(list:object): Observable<DataModel>{
      return this.http.post<DataModel>(environment.serverURI + 'data', list, httpOptions).pipe(
        map(res => {
          return res;
        })
      );
    }

}
