import { Component, Input, OnInit } from '@angular/core';

import { Classification } from './classification.model';
import { ApiService } from '../../services/api.service';

@Component({
    moduleId: module.id,
    selector: 'classification',
    templateUrl: 'classification.component.html',
    providers: [ ApiService ]
})
export class ClassificationComponent implements OnInit {
    basicCharacters: String[];
    potentialSpoofs: String[];
    limitedPotentialSpoofs: String[];
    classifyCount: String;

    constructor(private apiService: ApiService) {}

    ngOnInit() {
        // find how many characters this visitor would like to classify
        let classifyCountInput = document.getElementById('classification-count') as HTMLInputElement;
        this.classifyCount = classifyCountInput.value;

        // get the basic characters from the API
        this.basicCharacters = this.apiService.getBasicCharacters()
            .subscribe(basicCharacters => this.basicCharacters = basicCharacters);

        // get the potential spoofs from the API and narrow down the potential spoofs to the number which the user specified
        this.potentialSpoofs = this.apiService.getCharacters()
            .subscribe(potentialSpoofs => this.narrowPotentialSpoofs(potentialSpoofs));
    }

    narrowPotentialSpoofs(potentialSpoofs: any) {
        /* Select the potential spoofs which will be shown to the visitor. */
        this.limitedPotentialSpoofs = this.potentialSpoofs.splice(0, Number(this.classifyCount));
    }

    clicked() {
        /* Pull the content from the form and post it to the feed */
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