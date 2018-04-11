import { Component, ViewChild } from '@angular/core';

import { ClassificationComponent } from '../classification/classification.component';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'home',
    templateUrl: 'home.component.html',
    providers: [ ApiService ]
})
export class HomeComponent {
    classifying: boolean;
    charsToClassify: number;
    welcomeTitle: string;
    highScores: {
        'initials': string,
        'score': number
    }[] = [];
    // this provides access to the classification component which is a child of this component
    @ViewChild(ClassificationComponent) classifier: ClassificationComponent;

    constructor(private apiService: ApiService) {
        this.classifying = false;
        this.welcomeTitle = 'Welcome!';
        this.charsToClassify = 10;

        this.apiService.getHighScores()
            .subscribe(highScores => {
                // pull the initials and score from the API
                for (var i = highScores._items.length - 1; i >= 0; i--) {
                    this.highScores.push({
                        'initials': highScores._items[i].initials,
                        'score': highScores._items[i].score
                    });
                }

                // sort the high scores
                this.highScores.sort((a: any, b: any) => {
                    if (a.score < b.score) {
                        return 1;
                    } else if(a.score > b.score) {
                        return -1;
                    }
                    return 0;
                })

                // only take the top 10 scores
                this.highScores = this.highScores.slice(0, 10);
            });
    }

    startClassifying() {
        /* Display the classifier. */
        // if we are already classifying and the user hits the main, submit button again, restart the child, classifier component
        if (this.classifying) {
            this.classifier.init(this.charsToClassify);
        } else {  // if we are not already classifying, by all means... start!
            this.classifying = true;
        }
    }

    updateWelcomeTitle(welcomeTitleEvent: string) {
        /* This function receives the callback when the welcomeTitle is updated from the child component (../classification/classification.component.ts). */
    }
}
