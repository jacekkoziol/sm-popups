import { Component, OnInit, ElementRef, Input} from '@angular/core';
import { ToggleContainerComponent } from '../../core/toggle-container/toggle-container.component';
import { Option } from '../../core/a-models/options';

@Component({
  selector: 'sm-select-list',
  templateUrl: './select-list.component.html',
  styleUrls: ['./select-list.component.scss']
})
export class SelectListComponent extends ToggleContainerComponent implements OnInit {

  @Input() css:string;

  // SmPositionDirective params
  @Input() position:string|undefined = undefined;
  @Input() positionLuncher:HTMLElement|undefined = undefined;
  @Input() positionPreventAdjust:boolean = false;

  constructor(
    protected currentComponent:ElementRef
  ) {
    super(currentComponent)
  }

  ngOnInit() {
  }

}
