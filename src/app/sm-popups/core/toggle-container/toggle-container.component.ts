import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'sm-toggle-container',
  templateUrl: './toggle-container.component.html',
  styleUrls: ['./toggle-container.component.scss']
})
export class ToggleContainerComponent implements OnInit {

  @Input() private isOpen:boolean = false;
  @Input() private css:string;
  @Input() private luncher:string = '';   // usage like document.querySelectorAll(), eg.: [luncher]="'#some-id, .someClass'"

  @Input() private preventCloseContentClick:boolean = false;   // prevent Close if toggle-container area is clicked

  @Output() onStateChange = new EventEmitter<any>();

  private luncherElement:HTMLElement | undefined;

  constructor(
    private currentComponent:ElementRef
  ) { }

  ngOnInit() {
  }

  ngOnChanges(newVal) {
    if (newVal.isOpen && newVal.isOpen.currentValue !== undefined) {

      window.setTimeout(()=>{
        this.setModalState(newVal.isOpen.currentValue);
      }, 0);
    }

  }

  @HostListener('document:click', ['$event'])
  private onDocumentClick($ev) {
    console.log(this.getLunchers);
    if (this.getLunchers.length && this.elementIsLuncher($ev.target, this.getLunchers) && !this.isOpen) {
      this.luncherElement = $ev.target;
      this.openToggleContainer();
    } else {
      console.log(this.preventCloseContentClick, this.currentComponent.nativeElement, $ev)

      this.closeToggleContainer();
    }
  }

  @HostListener('document:keydown', ['$event'])
  private onKeyPress($ev:KeyboardEvent) {
    if ($ev.keyCode == 27) {
      this.closeToggleContainer();
    }
  }

  private get getLunchers():NodeList {
    if(!this.luncher.trim().length) {
      return document.querySelectorAll('_no-string-defined');
    }

    return document.querySelectorAll(this.luncher);
  }

  private openToggleContainer() {
    this.setModalState(true);
  }

  public closeToggleContainer($ev?):void {
    //$ev && $ev.preventDefault();
    this.setModalState(false);
  }

  public setModalState(state) {
    this.isOpen = state;
    this.onStateChange.emit({isOpen: state, luncher: this.luncherElement});
  }


  // Helpers
  private elementIsLuncher(elementToCheck:HTMLElement, elementsList:NodeList):boolean {
    for (let i=0; i < elementsList.length; i++) {
      if (elementToCheck === elementsList[i]) {
        return true;
      }
    }

    return false;
  }

}
