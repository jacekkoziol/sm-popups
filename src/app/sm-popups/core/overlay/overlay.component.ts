import { Component, OnInit } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'sm-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OverlayComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
