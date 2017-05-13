import { Component } from '@angular/core';

// import { Classification } from '../classification/classification.model';
// import { ClassificationComponent } from '../classification/classification.component';
// import { ApiService } from '../../services/api.service';

@Component({
    moduleId: module.id,
    selector: 'home',
    templateUrl: 'home.component.html'
})
export class HomeComponent {
    name: String;
    classifying: Boolean;
    // classifications: Classification[];
    // selectedClassification: Classification;

    constructor() {
        this.classifying = false;
    }

    startClassifying() {
        /* Display the classifiers */
        this.classifying = true;
    }
}
