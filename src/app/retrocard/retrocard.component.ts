import { Component, OnInit, EventEmitter, ComponentRef  } from '@angular/core';
import {RetroService} from '../retro.service';
import {Card} from '../models/model';

@Component({
  selector: 'app-retrocard',
  templateUrl: './retrocard.component.html',
  styleUrls: ['./retrocard.component.css', '../app.component.css']
})
export class RetrocardComponent implements OnInit {

  editMode = true;
  cardContent = ''
  retroId = ''
  sectionId = 0;
  id = 0;
  likes = 0;
  componentRef: ComponentRef<any>;
  deleteCard: EventEmitter<string> =  new EventEmitter();


  constructor(private retroService: RetroService) {
  }

  ngOnInit() {
  }

  addCard() {
    if (this.cardContent) {
      console.log(this.cardContent);
      this.initiateSaveCard(this.getRetrocardPOJO());
      this.editMode = false;
      this.retroService.releaseCardEditContentLock();
    }


  }

  saveCard(data, card) {
    console.log(data);
    let newCard = true;
    const sectionId = this.sectionId;
    for (const section of data.sections) {
      if (section.id  === sectionId) {
        if (!section.cards) {
          section.cards = [];
        }
        for (let j = 0; j < section.cards.length; j++) {
          if (section.cards[j].id === card.id) {
            section.cards[j].content = card.content;
            newCard = false;
          }
        }
        if (newCard) {
          section.cards.push(card);
        }

      }
    }
    console.log('hi')
    console.log(data)
    this.retroService.persistRetro(this.retroId, data).subscribe(res =>  console.log(res), error => console.log(error));;

  }

  updateCard(data, card) {
    console.log(data)
    const sectionId = this.sectionId;
    for (const section of data.sections) {
      if (section.id  === sectionId) {
        if (!section.cards) {
          section.cards = [];
        }
        for (let j = 0; j < section.cards.length; j++) {
          if (section.cards[j].content === card.content) {
            section.cards[j].likes = card.likes;
          }
        }

      }
    }
    this.retroService.persistRetro(this.retroId, data).subscribe(res =>  console.log(res), error => console.log(error));;

  }

  edit() {
    this.retroService.applyCardEditContentLock();
    this.editMode = true;

  }

  likeCard() {
    this.retroService.applyCardEditLikesLock();
    setTimeout(() => {
      this.retroService.releaseCardEditLikesLock();
    }, 7000);
    this.likes++;
    this.initiateUpdateCard(this.getRetrocardPOJO());
  }

  getRetrocardPOJO() {
    const card = new Card()
    card.id = this.id;
    card.sectionId = this.sectionId;
    card.content = this.cardContent;
    card.retroId = this.retroId;
    card.likes = this.likes;
    return card;
  }

  initiateSaveCard(card) {
    this.retroService.getRetroDetails(this.retroId).subscribe(data =>  this.saveCard(data, card), error => console.log(error));
  }

  initiateUpdateCard(card) {
    this.retroService.getRetroDetails(this.retroId).subscribe(data =>  this.updateCard(data, card), error => console.log(error));
  }

  removeCard() {
    console.log('Deleting card');
    this.componentRef.destroy();
    this.deleteCard.emit(this.cardContent.toString());
  }

  setComponentRef(ref){
    this.componentRef = ref;
  }




}
