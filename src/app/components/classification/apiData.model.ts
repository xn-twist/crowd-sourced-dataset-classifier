import { ApiDataItem } from './apiDataItem.model';

export class ApiData {
    "_items": ApiDataItem[];
    "_links": {
        "parent": {
            "href": string,
            "title": string
        },
        "self": {
            "href": string,
            "title": string
        }
    };
    "_meta": {
        "max_results": number,
        "page": number,
        "total": number
    };
}