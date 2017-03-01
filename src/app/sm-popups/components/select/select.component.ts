import { Component, OnInit, Input, ViewChild, HostListener} from '@angular/core';
import { ToggleContainerComponent } from '../../core/toggle-container/toggle-container.component';
import { Option } from '../../core/a-models/options';

@Component({
  selector: 'sm-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {

  @Input() css:string;
  @Input() options:Option[] = [];
  @Input() activeOption:Option = new Option();
  @Input() placeholder:string = 'Please select';

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
  private selectedOption:Option = this.activeOption;

  constructor(
  ) {}

  ngOnInit() {
  }

  private openList():void {
    this.listIsOpen = !this.listIsOpen;
  }

  private onOptionChange($ev) {
    setTimeout(() => {
      this.selectedOption = $ev.selectedOption;
    }, 0);
  }


}
