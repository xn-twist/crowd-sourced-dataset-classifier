import { Component } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'home',
    templateUrl: 'home.component.html'
})
export class HomeComponent {
    classifying: Boolean;

    constructor() {
        this.classifying = false;
    }

    startClassifying() {
        /* Display the classifier */
        this.classifying = true;
    }
}
