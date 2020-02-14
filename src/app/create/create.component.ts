import { Component, OnInit } from '@angular/core';
import {RetroService} from '../retro.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  title;
  name;
  team;
  desc;
  constructor( private retroService: RetroService, private router: Router) { }

  ngOnInit() {
    this.title = 'The Amazing Retro Board';
  }

  createRetroBoard() {
    const self = this;
    this.retroService.createRetroBoard(this.name, this.team, this.desc).subscribe(res =>  self.redirect(res), error => console.log(error));;
  }

  redirect(res) {
    const url = 'retro/' + res.retroId;
    console.log(url)
    this.router.navigateByUrl(url).then(e => {
      if (e) {
        console.log('Navigation is successful!');
      } else {
        console.log('Navigation has failed!');
      }
    });

  }
}
