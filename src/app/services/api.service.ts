import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {
    baseApiPath: string;

    constructor(private http: Http) {
        this.baseApiPath = "http://miceandmen.tk:5000/feed";
    }

    getData() {
        return this.http.get(this.baseApiPath + "characters")
          .map(response => response.json());
    }

    sendData(updatedData: any) {
        let headers = new Headers({ 'Content-Type': 'application/json'});
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.baseApiPath, updatedData, options)
          .map(response => response.json());
    }
}