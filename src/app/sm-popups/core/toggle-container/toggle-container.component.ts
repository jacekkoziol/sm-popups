import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ElementRef, HostListener, Renderer} from '@angular/core';

@Component({
  selector: 'sm-toggle-container',
  exportAs: 'sm-toggle-container',
  templateUrl: './toggle-container.component.html',
  styleUrls: ['./toggle-container.component.scss'],
})
export class ToggleContainerComponent implements OnInit {

  @Input() protected isOpen:boolean = false;
  @Input() protected css:string;
  @Input() protected luncher:string|HTMLElement = '';   // usage like document.querySelectorAll(), eg.: [luncher]="'#some-id, .someClass'"
  @Input() protected useLuncherWidth:boolean = false;  //Use luncher width as min-width for tooltip

  @Input() protected preventCloseContentClick:boolean = false;   // prevent Close if toggle-container area is clicked

  @Output() onStateChange = new EventEmitter<any>();

  private componentIqID:string = '';
  private allowCloseContainer:boolean = true;
  public luncherElement:HTMLElement | undefined;
  public minWidthForTooltip:string = '';

  constructor(
    protected currentComponent:ElementRef,
    protected renderer:Renderer
  ) {
    this.componentIqID = 'toggle_container_' + this.generateUUID();
  }

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

    if (this.getLunchersAsArray.length && this.elementIsLuncher(evTarget, this.getLunchersAsArray) && !this.isOpen) {
      this.luncherElement = evTarget;
      this.openToggleContainer();
    } else {
      if (this.preventCloseContentClick && this.isOpen && this.elementIsInContent(evTarget) || !this.allowCloseContainer) {
        return;
      }

      this.closeToggleContainerIfOpen();
    }
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeyPress($ev:KeyboardEvent) {
    if ($ev.keyCode == 27) {
      this.closeToggleContainerIfOpen();
    }
  }

  protected get getLunchersAsArray():HTMLElement[] {
    let nodeListArray:HTMLElement[] = [];

    if(this.luncher instanceof HTMLElement) {
      nodeListArray.push(this.luncher);
    } else if (typeof this.luncher === 'string' && this.luncher.trim().length) {
      let nodeList = document.querySelectorAll(this.luncher);
      nodeListArray = Array.prototype.slice.call(nodeList);
    }

    return nodeListArray;
  }

  protected setToggleContainerminWidthEqualToLuncherWidth():void {
    if (this.useLuncherWidth && this.luncherElement) {
      let luncherRect:ClientRect = this.luncherElement.getBoundingClientRect();
      this.minWidthForTooltip = luncherRect.width + 'px';
      this.renderer.setElementStyle(this.currentComponent.nativeElement, 'min-width', luncherRect.width + 'px');
    }
  }

  protected openToggleContainer($ev?):void {
    this.preventCloseDuringOpenning();
    this.setToggleContainerminWidthEqualToLuncherWidth();
    this.setState(true);
  }

  private closeToggleContainerIfOpen($ev?):void {
    this.isOpen && this.closeToggleContainer($ev);
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
    let secureCounter = 0;
    let tmpEvElement = evElement;
    let componentContent = document.getElementById(this.componentIqID);

    do {
      secureCounter++

      if(tmpEvElement == componentContent) {
        return true;
      }

      if (secureCounter > 500) {
        return false;
      }

    } while (tmpEvElement = tmpEvElement.parentElement)

    return false;
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

  protected elementIsLuncher(elementToCheck:HTMLElement, elementsList:HTMLElement[]):boolean {
    for (let i=0; i < elementsList.length; i++) {
      if (elementToCheck === elementsList[i]) {
        return true;
      }
    }

    return false;
  }

  private generateUUID():string {
    return Math.floor((1 + Math.random()) * 0x1000000000000000).toString(16);
  }
}
