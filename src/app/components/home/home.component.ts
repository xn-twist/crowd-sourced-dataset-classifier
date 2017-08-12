import { Component, ViewChild } from '@angular/core';

import { ClassificationComponent } from '../classification/classification.component';

@Component({
    moduleId: module.id,
    selector: 'home',
    templateUrl: 'home.component.html'
})
export class HomeComponent {
    classifying: boolean;
    charsToClassify: number;
    welcomeTitle: string;
    // this provides access to the classification component which is a child of this component
    @ViewChild(ClassificationComponent) classifier: ClassificationComponent;

    constructor() {
        this.classifying = false;
        this.welcomeTitle = "Welcome!";
        this.charsToClassify = 10;
    }

    startClassifying() {
        /* Display the classifier. */
        // if we are already classifying and the user hits the main, submit button again, restart the child, classifier component
        if (this.classifying) {
            this.classifier.init(this.charsToClassify);
        }
        // if we are not already classifying, by all means... start!
        else {
            this.classifying = true;
        }
    }

    updateWelcomeTitle(welcomeTitleEvent:string) {
        /* This function receives the callback when the welcomeTitle is updated from the child component (../classification/classification.component.ts). */
    }
}
