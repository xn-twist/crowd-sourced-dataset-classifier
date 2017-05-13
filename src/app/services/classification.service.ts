import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Classification } from '../components/classification/classification.model';
import 'rxjs/add/operator/map';

@Injectable()
export class ClassificationService {
    constructor(private http: Http) {}

    getClassifications() {
        return this.http.get('app/data/classification1.json')
            .map((res: Response) => res.json());
    }
}