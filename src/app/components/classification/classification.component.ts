import { Component, Input, OnInit } from '@angular/core';

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
    submitting: Boolean;

    constructor(private apiService: ApiService) {
        this.submitting = false;
        this.potentialSpoofs = [];
    }

    ngOnInit() {
        // find how many characters this visitor would like to classify
        let classifyCountInput = document.getElementById('classification-count') as HTMLInputElement;
        this.classifyCount = classifyCountInput.value;

        // get the basic characters from the API
        this.apiService.getBasicCharacters()
          .subscribe(basicCharacters => this.basicCharacters = basicCharacters);

        // get the potential spoofs from the API and narrow down the potential spoofs to the number which the user specified
        this.apiService.getCharacters()
          .subscribe(potentialSpoofs => this.narrowPotentialSpoofs(potentialSpoofs));
    }

    narrowPotentialSpoofs(potentialSpoofs: any) {
        /* Select the potential spoofs which will be shown to the visitor. */
        // get the potential spoof character from the entry in the API
        for (var i = 0; i < potentialSpoofs._items.length; i++) {
            if (potentialSpoofs._items[i].potential_spoof != undefined) {
                this.potentialSpoofs.push(potentialSpoofs._items[i].potential_spoof)
            }
        }

        // handle the desired classification count as a number
        var classifyCount = Number(this.classifyCount);

        // create a random number from which we will provide characters
        var seed = Math.floor(Math.random() * (this.potentialSpoofs.length - classifyCount));

        // create a short list of characters that the user can classify
        this.limitedPotentialSpoofs = this.potentialSpoofs.splice(seed, classifyCount);
    }

    submitData() {
        /* Pull the content from the form and post it to the feed. */
        this.submitting = true;

        var formData = [];

        var characterLabels = document.getElementsByClassName("character-label");
        var characterInputs = document.getElementsByClassName("character-input");

        for (var i = 0; i < characterInputs.length; ++i) {
            // treat the current input field as an HTMLInputElement so we can get the value of it later
            let thisInputField = characterInputs[i] as HTMLInputElement;

            if (thisInputField.value != "") {
                // get the value of the input field
                formData.push({
                    "character": thisInputField.value,
                    "spoof": characterLabels[i].innerHTML.replace(": ", "")
                });
            }
        }

        var angularApp = this;

        formData.forEach(function(characterData) {
            angularApp.apiService.sendData(characterData)
                .subscribe((arg: any) => console.log("Response: ", arg));
        });
    }

    classifyAgain() {
        /* Reload the page so the user can start classifying again. */
        location.reload();
    }

    noClassifyAgain() {
        /* Display a message for the user. */

    }
}