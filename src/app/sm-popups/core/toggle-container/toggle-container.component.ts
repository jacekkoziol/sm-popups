import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'sm-toggle-container',
  exportAs: 'sm-toggle-container',
  templateUrl: './toggle-container.component.html',
  styleUrls: ['./toggle-container.component.scss'],
})
export class ToggleContainerComponent implements OnInit {

  @Input() protected isOpen:boolean = false;
  @Input() protected css:string;
  @Input() protected luncher:string = '';   // usage like document.querySelectorAll(), eg.: [luncher]="'#some-id, .someClass'"

  @Input() protected preventCloseContentClick:boolean = false;   // prevent Close if toggle-container area is clicked

  @Output() onStateChange = new EventEmitter<any>();

  public luncherElement:HTMLElement | undefined;
  private allowCloseContainer:boolean = true;

  constructor(
    protected currentComponent:ElementRef
  ) { }

  ngOnInit() {
  }

  ngOnChanges(newVal) {
    if (newVal.isOpen && newVal.isOpen.currentValue !== undefined) {

      window.setTimeout(()=>{
        this.setState(newVal.isOpen.currentValue);
      }, 0);
    }

  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick($ev) {
    let evTarget = this.getElFromEvent($ev);

    if (this.getLunchers.length && this.elementIsLuncher(evTarget, this.getLunchers) && !this.isOpen) {
      this.luncherElement = evTarget;
      this.openToggleContainer();
    } else {

      if (this.preventCloseContentClick && this.elementIsInContent(evTarget) || !this.allowCloseContainer) {
        return;
      }

      this.closeToggleContainer();
    }
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeyPress($ev:KeyboardEvent) {
    if ($ev.keyCode == 27) {
      this.closeToggleContainer();
    }
  }

  protected get getLunchers():NodeList {
    if(!this.luncher.trim().length) {
      return document.querySelectorAll('_no-string-defined');
    }

    return document.querySelectorAll(this.luncher);
  }

  protected openToggleContainer($ev?):void {
    this.preventCloseDuringOpenning();
    this.setState(true);
  }

  public closeToggleContainer($ev?):void {
    //$ev && $ev.preventDefault();
    this.setState(false);
  }

  public setState(state) {
    this.isOpen = state;
    this.onStateChange.emit({isOpen: state, luncher: this.luncherElement});
  }

  protected elementIsInContent(evElement:HTMLElement) {
    let isInContent = false;

    do {
      if(evElement == this.currentComponent.nativeElement) {
        isInContent = true;
        break;
      }
    } while (evElement = evElement.parentElement)

    return isInContent;
  }

  private preventCloseDuringOpenning():void {
    if (!this.isOpen) {
      this.allowCloseContainer = false;
      setTimeout(()=>this.allowCloseContainer = true, 5);
    }
  }


  // Helpers
  protected getElFromEvent(ev) {
    return ev.srcElement || ev.target;
  }

  protected elementIsLuncher(elementToCheck:HTMLElement, elementsList:NodeList):boolean {
    for (let i=0; i < elementsList.length; i++) {
      if (elementToCheck === elementsList[i]) {
        return true;
      }
    }

    return false;
  }

}
