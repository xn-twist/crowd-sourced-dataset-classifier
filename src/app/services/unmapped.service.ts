import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UnmappedService {
    constructor(private http: Http) {}

    getUnmappedCharacters() {
        return this.http.get('app/data/unmapped.json')
            .map((res: Response) => res.json());
    }
}