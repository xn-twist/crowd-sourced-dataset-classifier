import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class BaseService {
    constructor(private http: Http) {}

    // TODO: move the functionality in this function into the function below when the classifications are initialized
    getBaseCharacters() {
        return this.http.get('app/data/base.json')
            .map((res: Response) => res.json());
    }

    getClassifications() {
        // for each classification file in the app/data directory, read that file in as a classification
        return [
            {'id': 1, 'name': 'asics', 'data': [{'baseCharacters': ['a'], 'unmappedCharacters': ['aaa']}]},
            {'id': 2, 'name': 'saucony', 'data': [{'baseCharacters': ['b'], 'unmappedCharacters': ['bee']}]},
        ]
    }
}
