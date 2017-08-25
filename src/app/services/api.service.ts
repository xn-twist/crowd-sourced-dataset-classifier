import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {
    baseApiPath: string;

    constructor(private http: Http) {
        this.baseApiPath = 'http://xntwist.tk:5000/';
    }

    getBasicCharacters() {
        /* Get the basic characters from the API. */
        return this.http.get(this.baseApiPath + 'basic_characters')
          .map(response => response.json());
    }

    getCharacters() {
        /* Get all, non-basic characters from the API. */
        return this.http.get(this.baseApiPath + 'non_basic_characters')
          .map(response => response.json());
    }

    getLeaderBoard() {
        /* Get the leader-board from the API. */
        // TODO: Implement api call for leaderboard once this api endpoint is up and running (2)
        // return this.http.get(this.baseApiPath + 'leader-board')
        //   .map(response => response.json());
        return [{
            'name': 'AAA',
            'score': 10
        }, {
            'name': 'BBB',
            'score': 15
        }, {
            'name': 'CCC',
            'score': 16
        }];
    }

    sendData(updatedData: any) {
        /* Send the provided data to the feed branch of the API. */
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.baseApiPath + 'feed', updatedData, options)
          .map(response => response.json());
    }

    suggestCharacterForDeprectation(updatedData: any) {
        /* Suggest a character for deprecation. */
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.baseApiPath + 'suggested_deprecations', updatedData, options)
          .map(response => response.json());
    }
}
