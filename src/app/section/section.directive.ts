import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appSectionContainer]'
})
export class SectionDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}

