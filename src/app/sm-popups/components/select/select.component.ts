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
  @Input() selectedOptionTextMask:string = '';

  @Input() placeholder:string = 'Please select';
  @Input() name:string = '';
  @Input() id:string = '';
  @Input() required:boolean = true;
  @Input() disabled:boolean = false;

  @Output() onSelect:EventEmitter<any> = new EventEmitter();
  @Output() onChange:EventEmitter<any> = new EventEmitter();

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
  private oldSelectedOption:Option = new Option();
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

  private onOptionChange($ev, force = false):void {
    setTimeout(() => {
      this.oldSelectedOption = Object.assign({},this.selectedOption);
      this.selectedOption = $ev.selectedOption;

      let data = Object.assign({},$ev,{
        listState: this.tooltip.isOpen ? 'open' : 'close'
      });

      this.emitChangedData(data);
      this.emitSelectedData(data, force);
    }, 0);
  }

  private emitSelectedData(data, force = false):void {
    if (!force) {
      if (!(this.oldSelectedOption.id == this.selectedOption.id) || !(this.oldSelectedOption.text == this.selectedOption.text)) {
        this.onSelect.emit(data);
      }
    } else {
      this.onSelect.emit(data);
    }
  }

  private emitChangedData(data):void {
    this.onChange.emit(data);
  }

  private updateOptionsList():void {
    this.optionsList = this.options || [];
  }

  private updateSelectedOption():void {
    this.selectedOption = this.convertOptionFromAnyTypeToOption(this.activeOption) || new Option();
  }

  private selectFirstOption():void {
    let firstItem = this.optionsList[0];
    let firstListItem = {
      id: firstItem.id,
      text: firstItem.text,
      selectedOption: firstItem
    }
    this.onOptionChange(firstListItem, true);
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
