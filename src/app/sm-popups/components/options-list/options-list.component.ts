import { Component, OnInit, OnChanges, DoCheck, ElementRef, Input, Output, EventEmitter, ViewChild, HostListener} from '@angular/core';
import { Option } from '../../core/a-models/options';

interface eventData {
  id: string;
  text: string;
  selectedOption: Option;
}

@Component({
  selector: 'sm-options-list',
  templateUrl: './options-list.component.html',
  styleUrls: ['./options-list.component.scss'],
})
export class OptionsListComponent implements OnInit, OnChanges {

  @Input() css:string;

  @Input() options:any[] = [];
  @Input() hasSearch:boolean;
  @Input() resetInput:boolean;
  @Input() activeOption:any;//Option;
  @Input() allowKeyboardNavigation:boolean = false;
  @Input() focusInputOnInit:boolean = false;
  @Output() onChange:EventEmitter<any> = new EventEmitter();

  @ViewChild('refInputSearch') inputSearchRef;

  @HostListener('document:keydown', ['$event'])
  private handleKeyboardNavigation($ev:KeyboardEvent) {
    if(this.allowKeyboardNavigation) {
      this.keyboardNavigation($ev);
    }
  }

  private activeOptionToSelect:Option|undefined;
  private arrOptions:Option[];
  private arrOptionFiltered:Option[];
  private selectedOptionIndex:number;
  private optionHoverIndex:number;
  private optionsCount:number;
  private emptyOption:Option = new Option();
  public selectedOption:Option = this.emptyOption;

  /* helper */
  private oldOptions:any[] = this.options;
  private oldLength = 0;
  /* helper */

  constructor() { }

  ngOnInit() {
    this.formatActiveOption();
    this.formatOptionsList();
    this.filterOptions('');
    this.setDefaultOption();

    this.focusInputOnInit && setTimeout(()=>{ this.focusInput()}, 0);
  }

  ngOnChanges (newVal) {
    this.formatActiveOption();
    this.formatOptionsList();
    this.filterOptions('');

    if (newVal.resetInput && newVal.resetInput.currentValue) {
      this.resetInputField();
      this.focusInput();
    }
  }

  ngDoCheck(val) {
    if (this.oldOptions !== this.options) {
      let searchString = (this.inputSearchRef ) ? this.inputSearchRef.nativeElement.value : '';
      this.oldOptions = this.options;
      this.oldLength = this.options.length;
      this.updateOptionsList();
    } else {
      let newLength = this.options.length;
      let old = this.oldLength;

      if (old !== newLength) {
        this.oldLength = newLength;
        this.updateOptionsList();
      }
    }

  }

  private updateOptionsList() {
    let searchString = (this.inputSearchRef ) ? this.inputSearchRef.nativeElement.value : '';
    this.formatOptionsList();
    this.filterOptions(searchString);
    this.setDefaultOption();
  }

  private emitData(data:eventData) {
    this.onChange.emit(data);
  }

  private selectOption(option:Option, optionIndex?:number) {
    this.selectedOption = option;
    this.selectedOptionIndex = optionIndex;
    this.optionHoverIndex = optionIndex;
    this.emitData({
      id: option.id,
      text: option.text,
      selectedOption: option
    });
  }

  private filterOptions(search:string) {
    if (!search.trim().length && this.arrOptions) {
      this.arrOptionFiltered = this.arrOptions;
    } else {
      this.arrOptionFiltered = this.arrOptions.filter((el, i) => {
        this.updatedSelectedOptionIndexAfterFilter(el, i);
        return el.text.toLowerCase().indexOf(search.toLowerCase()) != -1
      });
    }

    this.optionsCount = this.arrOptionFiltered.length;
  }

  private updatedSelectedOptionIndexAfterFilter(el:Option, index:number) {
    if(el.id === this.selectedOption.id) {
      this.selectedOptionIndex = index;
    }
  }

  private setDefaultOption():void {
    if (this.arrOptions && this.arrOptions.length && this.activeOptionToSelect) {
      let defaultOptionIndex = this.arrOptions.findIndex(option => option.id === this.activeOptionToSelect.id);
      let currentSelectedOptionIndex = this.arrOptions.findIndex(option => option.id === this.selectedOption.id);

      if(this.selectedOption !== this.emptyOption && currentSelectedOptionIndex != -1) {
        // Just Do Nothing
      } else if(defaultOptionIndex != -1) {
        this.selectedOption = this.arrOptions[defaultOptionIndex];
        this.selectedOptionIndex = defaultOptionIndex;
      } else {
        this.selectedOption = this.emptyOption;
        this.selectedOptionIndex = 0;
      }

    } else {
      this.selectedOption = this.emptyOption;
      this.selectedOptionIndex = 0;
    }

    this.setAsHover(this.selectedOptionIndex);

    this.emitData({
      id: this.selectedOption.id,
      text: this.selectedOption.text,
      selectedOption: this.selectedOption
    });
  }

  private setAsHover(optionIndex:number) {
    this.optionHoverIndex = optionIndex;
  }

  private focusInput() {
    if (this.inputSearchRef && this.inputSearchRef.nativeElement) {
      this.inputSearchRef.nativeElement.focus();
    }
  }

  private blurInput() {
    if (this.inputSearchRef && this.inputSearchRef.nativeElement) {
      this.inputSearchRef.nativeElement.blur();
    }
  }

  private resetInputField() {
    if (this.inputSearchRef && this.inputSearchRef.nativeElement) {
      this.inputSearchRef.nativeElement.value = '';
    }
  }

  private keyboardNavigation($ev:KeyboardEvent) {
    switch ($ev.keyCode) {
      case 38: // Up
        $ev.preventDefault();
        this.hoverPrevOption();
        break;
      case 40: // Down
        $ev.preventDefault();
        this.hoverNextOption();
        break;
      case 13: // Enter
        $ev.preventDefault();
        this.selectOption(this.arrOptionFiltered[this.optionHoverIndex], this.optionHoverIndex);
        break;
      case 27: // Esc
        this.blurInput();
        break;
    }
  }

  private hoverPrevOption() {
    this.optionHoverIndex--

    if (this.optionHoverIndex < 0) {
      this.optionHoverIndex = this.optionsCount - 1;
    }
  }

  private hoverNextOption() {
    this.optionHoverIndex++

    if (this.optionHoverIndex >= this.optionsCount) {
      this.optionHoverIndex = 0;
    }
  }

  private formatActiveOption():void {
    this.activeOptionToSelect = (this.activeOption) ? this.convertOptionFromAnyTypeToOption(this.activeOption) : undefined;
  }


  private formatOptionsList():void {
    if (this.options && this.options.length) {
      this.arrOptions = this.options.map(el => {
        return this.convertOptionFromAnyTypeToOption(el);
      });
    } else {
      this.arrOptions = [];
      console.error('[sm-select-list]:: No options defined.');
    }
  }

  private convertOptionFromAnyTypeToOption(option:any):Option|undefined {
    if(option === undefined) {
      return;
    }

    if (typeof option == 'object' &&  'id' in option && 'text' in option) {
      return option;
    } else if (typeof option === 'string' || typeof option === 'number') {
      return new Option(String(option), String(option));
    } else {
      console.error('[sm-select-list]:: Wrong input data format.');
    }
  }

}
