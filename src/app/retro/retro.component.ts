import {Component, ComponentFactoryResolver, OnInit, OnDestroy, Output, ViewChild} from '@angular/core';
import {SectionComponent} from '../section/section.component';
import {SectionDirective} from '../section/section.directive';

import {ActivatedRoute} from '@angular/router';
import {RetroService} from '../retro.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-retro',
  templateUrl: './retro.component.html',
  styleUrls: ['./retro.component.css', '../app.component.css']
})
export class RetroComponent implements OnInit, OnDestroy{
  title = 'retro';
  teamName = 'Jaguar'
  numSections = 0;
  retroId = '';
  componentFactory = this.componentFactoryResolver.resolveComponentFactory(SectionComponent);
  viewContainerRef: any;
  showModal = false;
  header = ''
  exportData: any;

  @ViewChild(SectionDirective, {static: true}) sectionContainer: SectionDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private route: ActivatedRoute,
              private retroService: RetroService) { }

  addSection() {
    this.showModal = false;
    this.viewContainerRef = this.sectionContainer.viewContainerRef;
    const componentRef = this.viewContainerRef.createComponent(this.componentFactory);
    const section = componentRef.instance as SectionComponent;
    section.retroId = this.retroId;
    section.id = this.numSections++;
    section.header = this.header;
    this.header = '';
    section.setComponentRef(componentRef);
    section.deleteSection.subscribe(evt => this.initiateRemoveSection(evt));
    this.initiateSaveSection(section.getSectionPOJO());
  }

  initiateSaveSection(section) {
    this.retroService.getRetroDetails(this.retroId).subscribe(data =>  this.saveSection(data, section), error => console.log(error));
  }

  saveSection(data, section) {
    console.log(data)
    data.sections.push(section);
    console.log(data)
    this.retroService.persistRetro(this.retroId, data).subscribe(res =>  console.log(res), error => console.log(error));
  }

  initiateRemoveSection(section) {
    this.retroService.getRetroDetails(this.retroId).subscribe(data =>  this.removeSection(data, section));
  }

  removeSection(data, section) {
    console.log(data);
    data.sections.splice(data.sections.findIndex(e => e.id === parseInt(section, 10)),1);
    console.log(data)
    this.retroService.persistRetro(this.retroId, data).subscribe(res =>  console.log(res), error => console.log(error));
  }

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.showModal = false;
    this.retroId = this.route.snapshot.paramMap.get('id');
    this.retroService.getRetroDetails(this.retroId).subscribe(data =>  this.updateRetroView(data), error => console.log(error));
    this.setPeriodicUIRefresh();
  }

  setPeriodicUIRefresh() {
    this.retroService.getRetroDetails(this.retroId).
    subscribe(data => {
      this.exportData = data;
      console.log(data)
      this.updateRetroView(data);
      setTimeout(() => {
        this.setPeriodicUIRefresh();
      }, 7000);

    }, error => console.log(error));
  }

  updateRetroView(data) {
    if (this.retroService.getCardEditContentLock() || this.retroService.getCardEditLikesLock()) {
      return;
    }
    this.title = data.label;
    this.teamName = data.team;
    this.viewContainerRef = this.sectionContainer.viewContainerRef;
    this.viewContainerRef.clear();
    data.sections.forEach(item => {
      const componentRef = this.viewContainerRef.createComponent(this.componentFactory);
      const section = componentRef.instance as SectionComponent;
      section.deleteSection.subscribe(evt => this.initiateRemoveSection(evt));
      section.setComponentRef(componentRef)
      section.header = item.header;
      section.retroId = this.retroId
      section.id = item.id
      if (item.id >= this.numSections) {
          this.numSections = item.id + 1;
      }
      if (!item.cards) {
        item.cards = [];
      }
      item.cards.forEach(card => {
        (componentRef.instance as SectionComponent).addRetroCard(card);
      });
    });
  }

  exportAsExcel() {
    if (! this.exportData) {
      return;
    }
    RetroService.exportAsExcelFile(this.exportData);
  }

}
