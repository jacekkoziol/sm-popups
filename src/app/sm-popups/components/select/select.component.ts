import { Component, OnInit, OnChanges, Input, Output, ViewChild, HostListener, EventEmitter} from '@angular/core';
import { NgModel } from '@angular/forms';
import { ToggleContainerComponent } from '../../core/toggle-container/toggle-container.component';
import { Option } from '../../core/a-models/options';

@Component({
  selector: 'sm-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit, OnChanges {

  @Input() css:string;
  @Input() options:any[]; //Option[] = [];
  @Input() activeOption:any; //:Option = new Option();
  @Input() hasSearch:boolean = false;

  @Input() placeholder:string = 'Please select';
  @Input() name:string = '';
  @Input() id:string = '';
  @Input() required:boolean = true;

  @Output() onSelect:EventEmitter<any> = new EventEmitter();

  @ViewChild('refTooltip') private tooltip;
  @ViewChild('refOptonsList') private refOptionsList;
  @ViewChild('refInputModel') private refInputModel:NgModel;

  @HostListener('document:keydown', ['$event'])
  private closeTooltip($ev:KeyboardEvent):void {
    if($ev.keyCode == 13 && this.tooltip && this.tooltip.isOpen && this.refOptionsList && this.refOptionsList.optionsCount ) {
      setTimeout(()=>{
        this.tooltip.closeToggleContainer()
      },0);
    }
  }

  private listIsOpen:boolean = false;
  private selectedOption:Option = new Option();
  private optionsList:Option[] = [];

  public ngModel:NgModel;

  private valueId:string = '';
  private valueName:string = '';

  constructor(
  ) {}

  ngOnInit() {
    this.setIdAndNameOfSelectField();
    this.updateOptionsList();
    this.updateSelectedOption();
    setTimeout(() => {this.ngModel = this.refInputModel});
  }

  ngOnChanges(newVal) {
    if (newVal.options || newVal.activeOption) {
      this.updateOptionsList();
      this.updateSelectedOption();
    }
  }

  private setIdAndNameOfSelectField():void {
    let strIdName = 'select-like_' + this.generateUUID();

    this.id = this.id || strIdName;
    this.name = this.name || strIdName;

    this.valueId = this.id + '_value';
    this.valueName= this.name + '_value';
  }

  private onOptionChange($ev):void {
    setTimeout(() => {
      this.selectedOption = $ev.selectedOption;

      let data = Object.assign({},$ev,{
        listState: this.tooltip.isOpen ? 'open' : 'close'
      });

      this.emitData(data);
    }, 0);
  }

  private emitData(data):void {
    this.onSelect.emit(data);
  }

  private updateOptionsList():void {
    this.optionsList = this.options || [];
  }

  private updateSelectedOption():void {
    this.selectedOption = this.convertOptionFromAnyTypeToOption(this.activeOption) || new Option();
  }


  // Helper
  private generateUUID():string {
    return Math.floor((1 + Math.random()) * 0x10000000000).toString(16);
  }

  private convertOptionFromAnyTypeToOption(option:any):Option|undefined {
    if(!option) {
      return;
    }

    if (typeof option == 'object' &&  'id' in option && 'text' in option) {
      return option;
    } else if (typeof option === 'string' || typeof option === 'number') {
      return new Option(String(option), String(option));
    }

    return;
  }

}
