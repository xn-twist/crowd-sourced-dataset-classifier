import { Component } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'home',
    templateUrl: 'home.component.html'
})
export class HomeComponent {
    classifying: boolean;
    welcomeTitle: string;

    constructor() {
        this.classifying = false;
        this.welcomeTitle = "Welcome!";
    }

    startClassifying() {
        /* Display the classifier. */
        this.classifying = true;
    }

    updateWelcomeTitle(welcomeTitleEvent:string) {
        /* This function receives the callback when the welcomeTitle is updated from the child component (../classification/classification.component.ts). */
    }
}
