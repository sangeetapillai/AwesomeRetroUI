import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appRetrocard]'
})
export class RetrocardDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
