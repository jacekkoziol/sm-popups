import { Component, OnInit, OnChanges, ElementRef, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { ToggleContainerComponent } from '../../core/toggle-container/toggle-container.component';
import { Option } from '../../core/a-models/options';

interface eventData {
  id: string;
  text: string;
  filter: string;
}

@Component({
  selector: 'sm-select-list',
  templateUrl: './select-list.component.html',
  styleUrls: ['./select-list.component.scss']
})
export class SelectListComponent extends ToggleContainerComponent implements OnInit, OnChanges {

  @Input() css:string;

  @Input() options:any[];
  @Input() hasSearch:boolean;
  @Input() resetInput:boolean;
  @Output() onChange:EventEmitter<any> = new EventEmitter();

  @ViewChild('refInputSearch') inputSearchRef;

  // SmPositionDirective params
  @Input() position:string|undefined = undefined;
  @Input() positionLuncher:HTMLElement|undefined = undefined;
  @Input() positionPreventAdjust:boolean = false;

  private arrOptions:Option[];
  private arrOptionFiltered:Option[];
  private selectedOptionIndex:number;
  private optionHoverIndex:number;
  private optionsCount:number;
  public selectedOption:Option;

  constructor(
    protected currentComponent:ElementRef
  ) {
    super(currentComponent)
  }

  ngOnInit() {
    this.formatOptionsList();
    this.filterOptions('');
    this.setDefaultOption();
  }

  ngOnChanges (newVal) {
    this.formatOptionsList();
    this.filterOptions('');

    if (newVal.options) {
      this.setDefaultOption();
    }

    if (newVal.resetInput && newVal.resetInput.currentValue) {
      this.resetInputField();
      this.focusInput();
    }
  }


  /* To refactor */
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
      filter: option.id,
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
    if (this.arrOptions && this.arrOptions.length) {
      this.selectedOption = this.arrOptions[0];
      this.selectedOptionIndex = 0;
    } else {
      this.selectedOption = {id: '', text:''}
      this.selectedOptionIndex = 0;
    }

    this.setAsHover(this.selectedOptionIndex);

    this.emitData({
      id: this.selectedOption.id,
      text: this.selectedOption.text,
      filter: this.selectedOption.id,
    });
  }

  private setAsHover(optionIndex:number) {
    this.optionHoverIndex = optionIndex;
  }

  private focusInput() {
    console.log('mouseenter');
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

  private keyboardNavigation($ev) {
    switch ($ev.keyCode) {
      case 38: // Up
        this.hoverPrevOption();
        break;
      case 40: // Down
        this.hoverNextOption();
        break;
      case 13: // Enter
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


  private formatOptionsList():void {
    if (this.options && this.options.length) {
      this.arrOptions = this.options.map(el => {
        if (typeof el == 'object' && el.id && el.text) {
          return el;
        } else if (typeof el === 'string' || typeof el === 'number') {
          return Object.assign({},{},{
            id: el,
            text: el
          })
        } else {
          console.error('[app-select-filter]:: Wrong input data format.');
        }
      });
    } else {
      this.arrOptions = [];
      console.error('[app-select-filter]:: No options defined.');
    }
  }

}
