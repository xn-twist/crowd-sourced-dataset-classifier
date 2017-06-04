import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {
    baseApiPath: string;

    constructor(private http: Http) {
        this.baseApiPath = "http://miceandmen.tk:5000/";
    }

    getBasicCharacters() {
        /* Get the basic characters from the API. */
        return this.http.get(this.baseApiPath + "basic_characters")
          .map(response => response.json());
    }

    getCharacters() {
        /* Get all, non-basic characters from the API. */
        return this.http.get(this.baseApiPath + "non_basic_characters")
          .map(response => response.json());
    }

    sendData(updatedData: any) {
        /* Send the provided data to the feed branch of the API. */
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.baseApiPath + "feed", updatedData, options)
          .map(response => response.json());
    }

    suggestCharacterForDeprectation(updatedData: any) {
        /* Suggest a character for deprecation. */
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.baseApiPath + "suggested_deprecations", updatedData, options)
          .map(response => response.json());
    }
}