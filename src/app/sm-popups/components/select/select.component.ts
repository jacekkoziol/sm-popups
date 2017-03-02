import { Component, OnInit, Input, Output, ViewChild, HostListener, EventEmitter, forwardRef} from '@angular/core';
//import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { ToggleContainerComponent } from '../../core/toggle-container/toggle-container.component';
import { Option } from '../../core/a-models/options';

/*
const noop = () => {};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true
};
*/

@Component({
  selector: 'sm-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  //providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
//export class SelectComponent implements OnInit, ControlValueAccessor {
export class SelectComponent implements OnInit {

  @Input() css:string;
  @Input() options:Option[] = [];
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

  /**
   * TODO :: ngModel to custom element
   */
  //------
  /*
  //The internal data model
    private innerValue: any = '';

    //Placeholders for the callbacks which are later provided
    //by the Control Value Accessor
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    //get accessor
    get value(): any {
        return this.innerValue;
    };

    //set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }

    //Set touched on blur
    onBlur() {
        this.onTouchedCallback();
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
  //------
  */

}
