import { Component, OnInit } from '@angular/core';

import { Classification } from '../classification/classification.model';
import { ClassificationComponent } from '../classification/classification.component';
// import { BaseService } from '../../services/base.service';
// import { UnmappedService } from '../../services/unmapped.service';
import { ClassificationService } from '../../services/classification.service';

@Component({
    moduleId: module.id,
    selector: 'home',
    templateUrl: 'home.component.html',
    providers: [ ClassificationService ]
})
export class HomeComponent implements OnInit {
    name: string;
    classifications: Classification[];
    selectedClassification: Classification;

    constructor(private classificationService: ClassificationService) { }

    ngOnInit() {
        this.name = "Bob";
        this.classificationService.getClassifications()
            .subscribe(classification => this.classifications = [classification]);
    }

    onSelect(classification: Classification) {
        this.selectedClassification = classification;
        console.log(this.selectedClassification.data);

        // this.baseService.getBaseCharacters()
        //     .subscribe(baseChars => this.selectedClassification.data.baseCharacters = baseChars.base);

        // this.unmappedService.getUnmappedCharacters()
        //     .subscribe(unmappedChars => this.selectedClassification.data.unmappedCharacters = unmappedChars.unmapped);
    }
}
