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
    apiData: any;

    constructor(private apiService: ApiService) {}

    updateData(characterData: {"character": string, "spoof": string}) {
        /* Update the existing json as is appropriate */
        let characterInApi = false;
        let updatedData = {};
        let url = "";

        // check to see if the letter exists in the api data
        for (var i = 0; i < this.apiData._items.length; ++i) {
            // if this character already exists in the API, add the spoof to the list of spoofs
            if (this.apiData._items[i].character == characterData.character) {
                // console.log("character in api data and in form data match");
                let spoofInCharacterData = false;

                // find if the spoof character passed in from the form is already listed as a potential spoof... if so, simply increment the count. If not, add the character to the list.
                for (var j = 0; j < this.apiData._items[i].potential_spoofs.length; ++j) {
                    if (this.apiData._items[i].potential_spoofs[j].spoof_character == characterData.spoof) {
                        console.log("spoofed character match found and the count will be incremented");

                        spoofInCharacterData = true;
                        break;
                    }
                }

                if (!spoofInCharacterData) {
                    console.log("character was found, but the spoof has not been added to this character and will now be added.");
                }

                characterInApi = true;
                break;
            }
        }

        // if the character is not in the API yet, create the new character
        if (!characterInApi) {
            console.log("The character was not found in the API and will now be added");
            this.apiData._items.push({
                character: characterData.character,
                potential_spoofs: [characterData.spoof]
            });
            url = "";

            // this.apiService.sendData(updatedData, url)
            //     .subscribe(arg => console.log(arg));
        }
    }

    gatherFormData(apiData: any) {
        this.apiData = apiData;

        // pull the data from the input boxes
        let formData = Array<{"character": string, "spoof": string}>;

        var characterLabels = document.getElementsByClassName("character-label");
        var characterInputs = document.getElementsByClassName("character-input");

        for (var i = 0; i < characterInputs.length; ++i) {
            // get the value of the input field
              formData.push({
                  "character": characterInputs[i].value,
                  "spoof": characterLabels[i].innerHTML.trimEnd().replace(":", "")
              });
        }

        var angularApp = this;

        formData.forEach(function(characterData) {
            angularApp.updateData(characterData);
        });
    }

    clicked() {
        // get the API data
        this.apiService.getData()
            .subscribe(apiData => this.gatherFormData(apiData));
    }
}