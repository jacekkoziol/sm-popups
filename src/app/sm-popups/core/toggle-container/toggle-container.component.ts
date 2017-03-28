import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ElementRef, HostListener, Renderer} from '@angular/core';

const CSS_PREVENT_CONTENT_CLICK_CLOSE = 'sm-is-content-close-prevent';

interface NestedLevelInfoInterface {
  id: string;
  level: number;
}

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

  protected cssPreventContentClickClose:string = 'sm-is-content-close-prevented';

  private componentIqID:string = '';
  private componentIqIDParent:string = '';
  private allowCloseContainer:boolean = true;
  public luncherElement:HTMLElement | undefined;
  public minWidthForTooltip:string = '';

  static toggleCurrentLevel:number = 0;
  static toggleContainersCollection:string[] = [];
  static toggleNested:NestedLevelInfoInterface[] = [];

  constructor(
    protected currentComponent:ElementRef,
    protected renderer:Renderer
  ) {
    this.componentIqID = 'toggle_container_' + this.generateUUID();
    this.componentIqIDParent = this.componentIqID + '_parent';

    this.setParentComponentId();
    this.setPreventClickCssClass();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
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

      if (this.preventCloseContentClick && this.elementIsInContent(evTarget) || !this.allowCloseContainer) {
        return;
      }

      if (!this.checkAllowCloseNestedElement()) {
        return;
      }

      this.closeToggleContainerIfOpen($ev);
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
    this.updateNestedOnOpen();
  }

  private closeToggleContainerIfOpen($ev?):void {
    this.isOpen && this.closeToggleContainer($ev);
  }

  public closeToggleContainer($ev?):void {
    //$ev && $ev.preventDefault();
    this.setState(false);
    setTimeout(()=>{
      this.updateNestedOnClose();
    }, 5);
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
      setTimeout(()=>this.allowCloseContainer = true, 50);
    }
  }

  private setParentComponentId():void {
    this.renderer.setElementAttribute(this.currentComponent.nativeElement, 'id', this.componentIqIDParent);
  }

  private setPreventClickCssClass(addClass:boolean=true):void {
    this.renderer.setElementClass(this.currentComponent.nativeElement, CSS_PREVENT_CONTENT_CLICK_CLOSE, addClass);
  }

  private nestedTooltipsCount = 0;
  private updateNestedOnOpen():void {
    let thatComponent = this.currentComponent.nativeElement;
    let tooltipCounter = 0;

    do {
      if (thatComponent.classList.contains(this.cssPreventContentClickClose)) {
       tooltipCounter += 1;
      }
    } while (thatComponent = thatComponent.parentElement);

    this.nestedTooltipsCount = tooltipCounter;
    this.tmpAddToStatic();

    // update current level
    if (ToggleContainerComponent.toggleCurrentLevel < tooltipCounter) {
      ToggleContainerComponent.toggleCurrentLevel = tooltipCounter;
    }

    // console.log('open updated tooltip count:', this.nestedTooltipsCount);
    // console.log('open update static: ', ToggleContainerComponent.toggleContainersCollection);
    // console.log('open update static inf: ', ToggleContainerComponent.toggleNested);
    // console.log('open current level: ', ToggleContainerComponent.toggleCurrentLevel)
  }

  private updateNestedOnClose():void {
    let thatComponent = this.currentComponent.nativeElement;
    let tooltipCounter = 0;

    do {
      if (thatComponent.classList.contains(this.cssPreventContentClickClose)) {
       tooltipCounter += 1;
       //this.tmpAddToStatic();
      }
    } while (thatComponent = thatComponent.parentElement);

    this.tmpRemoveFromStatic(); //ADDED

    // update current level
    let hightIndex = 0;
    if (ToggleContainerComponent.toggleNested.length) {
      let indexes:number[] = [];
      ToggleContainerComponent.toggleNested.forEach(el =>{
        indexes.push(el.level);
      })
      // console.log('indexes', indexes);
      hightIndex = Math.max.apply(null, indexes)
      // console.info(hightIndex);
    }

    ToggleContainerComponent.toggleCurrentLevel = hightIndex;

    // console.log('open update static: ', ToggleContainerComponent.toggleContainersCollection);
    // console.log('open update static inf: ', ToggleContainerComponent.toggleNested);
    // console.log('open current level: ', ToggleContainerComponent.toggleCurrentLevel)
  }

  private tmpAddToStatic():void {
    if (ToggleContainerComponent.toggleContainersCollection.indexOf(this.componentIqID) == -1) {
      ToggleContainerComponent.toggleContainersCollection.push(this.componentIqID);

      ToggleContainerComponent.toggleNested.push({
        id: this.componentIqID,
        level: this.nestedTooltipsCount
      });
    }
  }

  private tmpRemoveFromStatic():void {
    let index = ToggleContainerComponent.toggleContainersCollection.indexOf(this.componentIqID);

    if (index != -1) {
      ToggleContainerComponent.toggleContainersCollection.splice(index, 1);
      ToggleContainerComponent.toggleNested.splice(index, 1);
    }
  }


  // Check if the tooltip is nested
  private checkAllowCloseNestedElement() {
    let index = ToggleContainerComponent.toggleContainersCollection.indexOf(this.componentIqID);
    let currenCompData = ToggleContainerComponent.toggleNested[index];

    //console.log('checks, currLevel', ToggleContainerComponent.toggleCurrentLevel);

    if (index != -1) {
      //close
      if(currenCompData.level >= ToggleContainerComponent.toggleCurrentLevel) {
        return true
      }
    }

    return false;
  }

  // Helpers
  protected getElFromEvent(ev):HTMLElement {
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
