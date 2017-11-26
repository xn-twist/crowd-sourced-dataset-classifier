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
    totalClassifiedCharactersCount: number = 0;
    userAcronym: string;
    classifyCount: number;
    submitting: boolean;
    apiUnresponsive: boolean;
    showInputs: boolean;
    tourTaken: boolean = false;
    // the two variables below handle the input/output for the welcome message
    @Input() welcomeTitle: string;
    @Output() welcomeTitleChange = new EventEmitter();
    leaderBoard: any[] = [];

    constructor(private apiService: ApiService) {
        // initialize the variables
        this.init(10);
        // get the data from the leader-board
        // this.leaderBoard = this.apiService.getHighScores();
        this.apiService.getHighScores()
            .subscribe(highScores => { for (var i = highScores._items.length - 1; i >= 0; i--) {
                this.leaderBoard.push({
                    'initials': highScores._items[i].initials,
                    'score': highScores._items[i].score
                });
            }});
    }

    init(charsToClassify: number) {
        /* Initialize the variables used in this component. This function exists outside of the constructor function because it is called by the `classifyAgain` function if the user decides to classify some more data. */
        if (this.leaderBoard !== undefined) {
            this.checkLeaderBoard();
        }
        this.submitting = false;
        this.potentialSpoofs = [];
        this.showInputs = false;
        this.classifyCount = charsToClassify;

        this.ngOnInit();
    }

    ngOnInit() {
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

    getUserName() {
        /* Get the user's acronym they would like to use for the leaderboard. */
        let acronym = prompt("You have a score high enough for the score board! Please enter your initials: ", "AAA");
        if (acronym == null || acronym == "") {
            this.userAcronym = "AAA";
        } else {
            this.userAcronym =  acronym.slice(0, 3).toUpperCase();
        }
    }

    checkLeaderBoard() {
        /* Check to see how the number of indicators classified so far compares to the leader board. */
        let newLeaderBoardEntry = undefined;
        // iterate through the leader board to see if the current count is a high score
        for (var i = this.leaderBoard.length - 1; i >= 0; i--) {
            if (this.totalClassifiedCharactersCount > this.leaderBoard[i].score) {
                if (this.userAcronym === undefined) {
                    // ask for the user's acronym
                    this.getUserName();
                }

                // add the new entry to the leader board
                newLeaderBoardEntry = {
                    'initials': this.userAcronym,
                    'score': this.totalClassifiedCharactersCount
                };

                // update the local copy of the high scores
                this.leaderBoard.push(newLeaderBoardEntry);
                break;
            }
        }

        if (newLeaderBoardEntry !== undefined) {
            // update the high scores in the api
            // this.apiService.updateHighScores(this.leaderBoard);
            this.apiService.updateHighScores(newLeaderBoardEntry)
                .subscribe(arg => console.log("updated high scores: ", arg));
        }
    }

    narrowPotentialSpoofs(potentialSpoofs: any) {
        /* Select the potential spoofs which will be shown to the visitor. */
        // get the potential spoof character from the entry in the API
        for (let i = 0; i < potentialSpoofs._items.length; i++) {
            if (potentialSpoofs._items[i].potential_spoof !== undefined) {
                this.potentialSpoofs.push(potentialSpoofs._items[i].potential_spoof);
            }
        }

        // create a random number from which we will provide characters
        const seed = Math.floor(Math.random() * (this.potentialSpoofs.length - this.classifyCount));

        // create a short list of characters that the user can classify
        this.limitedPotentialSpoofs = this.potentialSpoofs.splice(seed, this.classifyCount);

        this.showInputs = true;
    }

    submitData() {
        /* Pull the content from the form and post it to the feed. */
        let formData = [];

        const characterLabels = document.getElementsByClassName('character-label');
        const characterInputs = document.getElementsByClassName('character-input');

        for (let i = 0; i < characterInputs.length; ++i) {
            // treat the current input field as an HTMLInputElement so we can get the value of it later
            let thisInputField = characterInputs[i] as HTMLInputElement;

            if (thisInputField.value !== '') {
                // get the value of the input field
                formData.push({
                    'character': thisInputField.value.toLowerCase(),
                    'spoof': characterLabels[i].innerHTML.replace(': ', '')
                });
            }
        }

        const angularApp = this;

        // keep track of the number of characters this user has classified
        this.totalClassifiedCharactersCount += formData.length;

        formData.forEach(function(characterData) {
            angularApp.apiService.sendData(characterData)
                .subscribe((arg: any) => console.log('Response: ', arg));
        });

        // show the next-step buttons
        this.submitting = true;

        // hide the input boxes
        this.showInputs = false;
    }

    classifyAgain() {
        /* Reload the component so the user can start classifying again. */
        // update the welcome title at the top of the home component
        this.welcomeTitleChange.emit('You rock! Thanks for the help.');

        // restart the component by reinitializing variables and calling the ngOnInit() function again
        this.init(this.classifyCount);
    }

    removeCharacter(character: string) {
        /* Remove the given character from the UI and suggest it for deprecation in the API. */
        // keep track of the number of characters this user has classified
        this.totalClassifiedCharactersCount += 1;

        for (let i = this.limitedPotentialSpoofs.length - 1; i >= 0; i--) {
            if (this.limitedPotentialSpoofs[i] === character) {
                // remove the character from the list of potential spoofs in the UI
                this.limitedPotentialSpoofs.splice(i, 1);

                // post the character to the API
                this.apiService.suggestCharacterForDeprectation({'character': character})
                    .subscribe((arg: any) => console.log('Response: ', arg));
                break;
            }
        }
    }

    startTour() {
        const IntroJs = require('../../../../node_modules/intro.js/intro.js');
        let intro = IntroJs();
        // Initialize steps
        intro.setOptions({
            steps: [
                {
                    // element: document.querySelectorAll('#classificationMain')[0],
                    intro: "The goal is to identify non-Latin characters that could easily be mistaken for standard, Latin characters; these characters could be used to register domains targeting a specific organization.",
                    position: 'left'
                }, {
                    element: document.querySelectorAll('.potentialSpoof')[0],
                    intro: "This is a character that is not part of the standard, Latin character set. This character could be used to create spoofed websites targeting organizations.",
                    position: 'left'
                }, {
                    element: document.querySelectorAll('.characterInput')[0],
                    intro: " If the character to the left can be mistaken for a Latin character, type the Latin character here.",
                    position: 'right'
                }, {
                    element: document.querySelectorAll('.characterDeprecate')[0],
                    intro: "If there is very little chance of the non-Latin character on the left being mistaken for a Latin character, click this button to suggest that the character be deleted.",
                    position: 'right'
                }, {
                    element: '#characterSubmit',
                    intro: "When you're done, submit the results. Thank you!",
                    position: 'right'
                }
            ]
        });

        // Start tutorial
        intro.start();
        this.tourTaken = true;
    }
}
