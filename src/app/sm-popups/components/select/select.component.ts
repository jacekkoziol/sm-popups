import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { ToggleContainerComponent } from '../../core/toggle-container/toggle-container.component';
import { Option } from '../../core/a-models/options';

@Component({
  selector: 'sm-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {

  @Input() css:string;
  @Input() options:Option[];

  private listIsOpen:boolean = false;
  private selectedOption:Option = {
    id: 'id_1',
    text: 'Selected option'
  }

  constructor(
  ) {}

  ngOnInit() {
  }

  private openList():void {
    this.listIsOpen = !this.listIsOpen;
  }

}