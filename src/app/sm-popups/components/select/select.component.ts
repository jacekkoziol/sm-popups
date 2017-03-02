import { Component, OnInit, Input, Output, ViewChild, HostListener, EventEmitter, forwardRef} from '@angular/core';

import { ToggleContainerComponent } from '../../core/toggle-container/toggle-container.component';
import { Option } from '../../core/a-models/options';

@Component({
  selector: 'sm-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit {

  @Input() css:string;
  @Input() options:any[]; //Option[] = [];
  @Input() activeOption:Option = new Option();
  @Input() hasSearch:boolean = false;

  @Input() placeholder:string = 'Please select';
  @Input() name:string = '';
  @Input() id:string = '';
  @Input() required:boolean = true;

  @Output() onSelect:EventEmitter<any> = new EventEmitter();


  @ViewChild('refTooltip') tooltip;


  @HostListener('document:keydown', ['$event'])
  private closeTooltip($ev:KeyboardEvent):void {
    if($ev.keyCode == 13 && this.tooltip && this.tooltip.isOpen) {
      setTimeout(()=>{
        this.tooltip.closeToggleContainer()
      },0);
    }
  }

  private listIsOpen:boolean = false;
  private selectedOption:Option = new Option();

  private labelId:string = '';
  private labelName:string = '';

  constructor(
  ) {}

  ngOnInit() {
    this.setIdAndNameOfSelectField();
    this.selectedOption = this.activeOption;
  }

  private setIdAndNameOfSelectField() {
    let strIdName = 'select-like_' + this.generateUUID();

    this.id = this.id || strIdName;
    this.name = this.name || strIdName;

    this.labelId = this.id + '_label';
    this.labelName= this.name + '_label';
  }

  private onOptionChange($ev) {
    setTimeout(() => {
      this.selectedOption = $ev.selectedOption;

      let data = Object.assign({},$ev);
      this.emitData(data);
    }, 0);
  }

  private emitData(data) {
    this.onSelect.emit(data);
  }


  // Helper
  private generateUUID():string {
    return Math.floor((1 + Math.random()) * 0x10000000000).toString(16);
  }

}
