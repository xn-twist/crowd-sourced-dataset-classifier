import { Component, Input } from '@angular/core';

import { Classification } from './classification.model';
import { ApiData } from './apiData.model';
import { ApiService } from '../../services/api.service';

@Component({
    moduleId: module.id,
    selector: 'classification',
    templateUrl: 'classification.component.html',
    providers: [ ApiService ]
})
export class ClassificationComponent {
    @Input() classification: Classification

    constructor(private apiService: ApiService) {}

    clicked() {
        // pull the data from the input boxes
        var formData = [];

        var characterLabels = document.getElementsByClassName("character-label");
        var characterInputs = document.getElementsByClassName("character-input");

        for (var i = 0; i < characterInputs.length; ++i) {
            // treat the current input field as an HTMLInputElement so we can get the value of it later
            let thisInputField = characterInputs[i] as HTMLInputElement;

            // get the value of the input field
            formData.push({
                "character": thisInputField.value,
                "spoof": characterLabels[i].innerHTML.replace(": ", "")
            });
        }

        var angularApp = this;

        formData.forEach(function(characterData) {
            angularApp.apiService.sendData(characterData)
                .subscribe((arg: any) => console.log("Response: ", arg));
        });
    }
}