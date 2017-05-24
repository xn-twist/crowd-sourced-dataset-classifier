import { Component } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'home',
    templateUrl: 'home.component.html'
})
export class HomeComponent {
    classifying: Boolean;
    welcomeTitle: String;

    constructor() {
        this.classifying = false;
        this.welcomeTitle = "Welcome!";
    }

    startClassifying() {
        /* Display the classifier */
        this.classifying = true;
    }

    ping() {
        console.log("here");
    }
}
