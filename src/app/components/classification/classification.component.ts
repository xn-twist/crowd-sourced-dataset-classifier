import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { ApiService } from '../../services/api.service';

@Component({
    moduleId: module.id,
    selector: 'classification',
    templateUrl: 'classification.component.html',
    providers: [ ApiService ]
})
export class ClassificationComponent implements OnInit {
    basicCharacters: string[];
    potentialSpoofs: string[];
    limitedPotentialSpoofs: string[];
    classifyCount: string;
    submitting: boolean;
    apiUnresponsive: boolean;
    showInputs: boolean;
    @Input() welcomeTitle: string;
    @Output() welcomeTitleChange = new EventEmitter();

    constructor(private apiService: ApiService) {
        // initialize the variables
        this.init();
    }

    init() {
        /* Initialize the variables used in this component. */
        this.submitting = false;
        this.potentialSpoofs = [];
        this.showInputs = false;
    }

    ngOnInit() {
        console.log("here");
        // find how many characters this visitor would like to classify
        let classifyCountInput = document.getElementById('classification-count') as HTMLInputElement;
        this.classifyCount = classifyCountInput.value;

        // get the basic characters from the API
        this.apiService.getBasicCharacters()
          .subscribe(
              basicCharacters => this.basicCharacters = basicCharacters,
              (err) => this.apiUnresponsive = true
          );

        // get the potential spoofs from the API and narrow down the potential spoofs to the number which the user specified
        this.apiService.getCharacters()
          .subscribe(
              potentialSpoofs => this.narrowPotentialSpoofs(potentialSpoofs),
              (err) => this.apiUnresponsive = true
          );
    }

    narrowPotentialSpoofs(potentialSpoofs: any) {
        /* Select the potential spoofs which will be shown to the visitor. */
        // get the potential spoof character from the entry in the API
        for (var i = 0; i < potentialSpoofs._items.length; i++) {
            if (potentialSpoofs._items[i].potential_spoof !== undefined) {
                this.potentialSpoofs.push(potentialSpoofs._items[i].potential_spoof)
            }
        }

        // handle the desired classification count as a number
        var classifyCount = Number(this.classifyCount);

        // create a random number from which we will provide characters
        var seed = Math.floor(Math.random() * (this.potentialSpoofs.length - classifyCount));

        // create a short list of characters that the user can classify
        this.limitedPotentialSpoofs = this.potentialSpoofs.splice(seed, classifyCount);

        this.showInputs = true;
    }

    submitData() {
        /* Pull the content from the form and post it to the feed. */
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

        // show the next-step buttons
        this.submitting = true;

        // hide the input boxes
        this.showInputs = false;
    }

    classifyAgain() {
        /* Reload the component so the user can start classifying again. */
        // update the welcome title at the top of the home component
        this.welcomeTitleChange.emit("You rock! Thanks for the help.");

        // restart the component by reinitializing variables and calling the ngOnInit() function again
        this.init();
        this.ngOnInit();
    }
}