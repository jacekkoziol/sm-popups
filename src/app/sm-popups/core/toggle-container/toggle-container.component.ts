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

  //private nestedLevel = 0;

  //static toggleContainersCollection:ToggleContainerComponent[] = [];
  static toggleCurrentLevel:number = 0;
  static toggleContainersCollection:string[] = [];
  static toggleNested:NestedLevelInfoInterface[] = [];

  //static level:number = 0;

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
    this.updateNestedOnOpen(); //TEST
  }

  private closeToggleContainerIfOpen($ev?):void {
    // TODO:: prevent close parent tooltip if close prevented
    this.isOpen && this.closeToggleContainer($ev);
  }

  public closeToggleContainer($ev?):void {
    //$ev && $ev.preventDefault();
    this.setState(false);
    setTimeout(()=>{
      this.updateNestedOnClose();
    }, 5);
    //this.updateNestedOnClose();
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
      //if(tmpEvElement == componentContent || this.luncherElement.parentElement == componentContent) {
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
       //this.tmpAddToStatic();
      }
    } while (thatComponent = thatComponent.parentElement);

    this.nestedTooltipsCount = tooltipCounter;
    this.tmpAddToStatic();

    // update current level
    if (ToggleContainerComponent.toggleCurrentLevel < tooltipCounter) {
      ToggleContainerComponent.toggleCurrentLevel = tooltipCounter;
    }

    //ToggleContainerComponent.toggleCurrentLevel = (ToggleContainerComponent.toggleCurrentLevel < tooltipCounter) ? tooltipCounter : ToggleContainerComponent.toggleCurrentLevel

    //console.log('open updated tooltip count:', this.nestedTooltipsCount);
    console.log('open update static: ', ToggleContainerComponent.toggleContainersCollection);
    console.log('open update static inf: ', ToggleContainerComponent.toggleNested);
    console.log('open current level: ', ToggleContainerComponent.toggleCurrentLevel)
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
      let indexes:number[] = [];// = ToggleContainerComponent.toggleNested.map(el=> el.level);
      ToggleContainerComponent.toggleNested.forEach(el =>{
        indexes.push(el.level);
      })
      console.log('indexes', indexes);
      hightIndex = Math.max.apply(null, indexes)// Math.max(indexes);
      console.info(hightIndex);
    } else {
      //ToggleContainerComponent.toggleCurrentLevel = 0
    }
    ToggleContainerComponent.toggleCurrentLevel = hightIndex;
    
    //ToggleContainerComponent.toggleCurrentLevel = tooltipCounter;
    //if (ToggleContainerComponent.toggleCurrentLevel  tooltipCounter) {
      //ToggleContainerComponent.toggleCurrentLevel = tooltipCounter;
    //}
    //dodać wszystkie poziomy do tablicy i wybrać po zamknięciu ten najwyższy

    console.log('open update static: ', ToggleContainerComponent.toggleContainersCollection);
    console.log('open update static inf: ', ToggleContainerComponent.toggleNested);
    console.log('open current level: ', ToggleContainerComponent.toggleCurrentLevel)
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


  // TODO:: check if in line
  private checkAllowCloseNestedElement() {
    let index = ToggleContainerComponent.toggleContainersCollection.indexOf(this.componentIqID);
    let currenCompData = ToggleContainerComponent.toggleNested[index];

    console.log('checks, currLevel', ToggleContainerComponent.toggleCurrentLevel);

    if (index != -1) {
      //console.log('checkAllow:', index);
      //console.log('checkAllow currentCompLevel',currenCompData.level);

      //close
      if(currenCompData.level >= ToggleContainerComponent.toggleCurrentLevel) {
        return true
      }
    }

    //return false;
    return false; //true;
  }

  // TODO:: EventClickNestetHandle
  /*
  private testPrevent(evElement:HTMLElement) {
    // itteruj
    // jeżeli element ma klase prevent lub parent element ma klase prewent - iteruj
    // jezeli iterator > 1 , return true - zatrzumaj zamykanie

    let secureCounter = 0;
    let tmpEvElement:HTMLElement = evElement;
    let componentContent = document.getElementById(this.componentIqID);
    let thatComponent = this.currentComponent.nativeElement;

    let tooltipCounter = 0;

    //this.closeToggleContainerIfOpen();

    do {
      secureCounter++

      //console.log('element:', componentContent == tmpEvElement, tmpEvElement);
      if (thatComponent.classList.contains(this.cssPreventContentClickClose)) {
       // this.allowCloseContainer = false;
       tooltipCounter += 1;
       //console.log('zablokuj');

       //return true;
      }

      //console.log(tooltipCounter);
      //if(tooltipCounter == this.nestedTooltipsCount) {
      if(tooltipCounter > this.nestedTooltipsCount) {
        this.closeToggleContainerIfOpen()
      }
      

      if (secureCounter > 500) { return false}

    } while (thatComponent = thatComponent.parentElement);

    console.log('curr:', tooltipCounter, this.nestedTooltipsCount);

    //if (ToggleContainerComponent.toggleContainersCollection.length == (this.nestedTooltipsCount + 1)) {
    if (this.nestedTooltipsCount < ToggleContainerComponent.toggleContainersCollection.length ) {
      let lastIndex = ToggleContainerComponent.toggleContainersCollection.length - 1;
      //console.log('allow close' );

      if(lastIndex > -1 && ToggleContainerComponent.toggleContainersCollection[lastIndex] == this.componentIqID) {
        console.log('close: => ', this.componentIqID);
      }
    }

  }
  */



  //private eventPropagationNestedElements($ev) {
  /*
  private parentIsInContent($ev) {
    let secureCounter = 0;
    let evElement:HTMLElement = this.getElFromEvent($ev);
    let tmpEvElement:HTMLElement = evElement;
    let componentContent = document.getElementById(this.componentIqID);
    let thatComponent = this.currentComponent.nativeElement;


    //jeśli parent jest w kontenerze z klasą prevent

    do {
      //secureCounter++

      //console.log('element:', componentContent == tmpEvElement, tmpEvElement);
      if (thatComponent.classList.contains(this.cssPreventContentClickClose)) {
       // this.allowCloseContainer = false;
       console.log('zablokuj');
       return true;
      }

      if (secureCounter > 500) {
        return false;
      }


    } while (thatComponent = thatComponent.parentElement);

    return false
  } */

  /*
  private eventPropagationNestedElements($ev) {
    //console.log($ev);
    let evElement:HTMLElement = this.getElFromEvent($ev);
    let secureCounter = 0;
    let tmpEvElement:HTMLElement = evElement;
    let componentContent = document.getElementById(this.componentIqID);
    console.info(this.allowCloseContainer);

    this._preventClose = false;
    

    do {
      secureCounter++

      //console.log('element:', componentContent == tmpEvElement, tmpEvElement);
      if (componentContent == tmpEvElement && tmpEvElement.classList.contains(this.cssPreventContentClickClose)) {
       // this.allowCloseContainer = false;
  
        //this._preventClose = true;
        break;
      }

      if (secureCounter > 500) {
        return false;
      }


    } while (tmpEvElement = tmpEvElement.parentElement)

    //setTimeout(()=>{this.allowCloseContainer = true}, 5000);
  }
  */

  // Manage Instance collection
  /*
  private addToInstaneCollection() {
    ToggleContainerComponent.toggleContainersCollection.push(this);
  }

  private removeLastFromInctanceCollection() {
    let lastElIndex = ToggleContainerComponent.toggleContainersCollection.length - 1;
    let lastElement = ToggleContainerComponent.toggleContainersCollection.splice(lastElIndex, 1);
  }

  private removeLastFromInctanceCollectionAndClose() {
    let lastElIndex = ToggleContainerComponent.toggleContainersCollection.length - 1;
    let lastElement = ToggleContainerComponent.toggleContainersCollection.splice(lastElIndex, 1);
    lastElement[0].closeToggleContainer();
  }
  */

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
