import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as ExcelJS from "exceljs/dist/exceljs";


@Injectable({
  providedIn: 'root'
})
export class RetroService {

  cardEditContentLock = false;
  cardEditLikesLock = false;


  static exportAsExcelFile(retro: any[]): void {

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Awesome Retro');

    worksheet.columns = [
      { header: '', key: '', width: 50  }
    ];

    const tRow = worksheet.addRow([retro['label']]);
    tRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };

    worksheet.addRow([]);

    const desc = worksheet.addRow([retro['desc']]);
    desc.font = { name: 'Comic Sans MS', family: 4, size: 12, bold: true };


    retro['sections'].forEach(section => {
      const header = [section.header];
      worksheet.addRow([]);
      const headerRow = worksheet.addRow(header);
      headerRow.eachCell((cell, number) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {argb: '00003366'},
          bgColor: {argb: 'FFFFFFFF'}
        }
        cell.border = {top: {style: 'thin'}, left: {style: 'thin'}, bottom: {style: 'thin'}, right: {style: 'thin'}}
        cell.font = {color: {argb: "FFFFFFFF"}}
      });
      const content = [];
      section.cards.forEach(card => {
        content.push([card.content, card.likes]);
      });
      worksheet.addRows(content);

    });

    workbook.xlsx.writeBuffer().then((d) => {
      const blob = new Blob([d], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      fs.saveAs(blob, retro['label'] + '_' + new Date() + '.xlsx');
    });
  }

  constructor(private http: HttpClient) {
  }

  getRetroDetails(retroId): Observable<any> {
    return this.http.get('http://localhost:3000/get?retroId=' + retroId);

  }

  persistRetro(retroId, data) {
    console.log(data);
    return this.http.post('http://localhost:3000/save?retroId=' + retroId, data);
  }

  getCardEditContentLock() {
    return this.cardEditContentLock;
  }

  getCardEditLikesLock() {
    return this.cardEditLikesLock;
  }

  applyCardEditContentLock() {
    this.cardEditContentLock = true;
  }

  applyCardEditLikesLock() {
    this.cardEditLikesLock = true;
  }

  releaseCardEditContentLock() {
    this.cardEditContentLock = false;
  }

  releaseCardEditLikesLock() {
    this.cardEditLikesLock = false;
  }

  createRetroBoard(title, team, desc) {
    const empty_json = {"label" : title, "desc":desc, "team" : team, "sections" : []};
    return this.http.post('http://localhost:3000/create', empty_json);
  }

}
