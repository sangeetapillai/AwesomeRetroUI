import {Component, EventEmitter, OnInit, OnDestroy, Output, ComponentFactoryResolver,  ComponentRef, ViewChild} from '@angular/core';
import { RetrocardComponent} from '../retrocard/retrocard.component';
import {SectionDirective} from './section.directive';
import {RetrocardDirective} from '../retrocard/retrocard.directive';
import {Section} from '../models/model';
import {RetroService} from '../retro.service';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css', '../app.component.css']
})
export class SectionComponent  implements OnInit, OnDestroy  {

  cards: Array<RetrocardComponent> = [];
  header = '';
  retroId = '';
  id = 0;
  numCards = 0;
  componentFactory = this.componentFactoryResolver.resolveComponentFactory(RetrocardComponent);
  viewContainerRef: any;
  componentRef: ComponentRef<any>;
  deleteSection: EventEmitter<string> =  new EventEmitter();

  @Output() delete: EventEmitter<string> = new EventEmitter();

  @ViewChild(RetrocardDirective, {static: true}) retrocardContainer: RetrocardDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private retroService: RetroService) {}

  addRetroCard(savedCard = null) {

    this.viewContainerRef = this.retrocardContainer.viewContainerRef;
    const viewRef = this.viewContainerRef.createComponent(this.componentFactory)
    const card =  viewRef.instance as RetrocardComponent
    card.setComponentRef(viewRef);
    card.deleteCard.subscribe(evt => this.initiateRemoveCard(evt));

    card.retroId = this.retroId;
    card.sectionId = this.id;
    if (savedCard) {
      card.cardContent = savedCard.content;
      card.id = savedCard.id
      card.likes = savedCard.likes;
      if (savedCard.id >= this.numCards) {
          this.numCards = savedCard.id + 1;
      }
    } else {
      card.id = this.numCards++;
      card.likes = 0;
      this.retroService.applyCardEditContentLock();
    }

    if (savedCard) {
      card.editMode = false;
    }
  }


  ngOnInit(): void {

  }

  removeSection() {
    console.log('Deleting section');
    this.componentRef.destroy();
    this.deleteSection.emit(this.id.toString());

  }

  ngOnDestroy(): void {
  }

  getSectionPOJO() {
    const section = new Section()
    section.id = this.id;
    section.header = this.header;
    section.retroId = this.retroId;
    return section;

  }

  setComponentRef(ref){
    this.componentRef = ref;
  }

  initiateRemoveCard(card) {
    console.log(card)
    this.retroService.getRetroDetails(this.retroId).subscribe(data =>  this.removeCard(data, card), error => console.log(error));
  }

  removeCard(data, card) {
    console.log(card)
    const sectionId = this.id;
    for (const section of data.sections) {
      if (section.id  === sectionId) {
        if (!section.cards) {
          section.cards = [];
        }
        for (let j = 0; j < section.cards.length; j++) {
          if (section.cards[j].content === card) {
            section.cards.splice(j);
          }
        }
      }
    }
    console.log('hi')
    console.log(data)
    this.retroService.persistRetro(this.retroId, data).subscribe(res =>  console.log(res), error => console.log(error));
  }

}
