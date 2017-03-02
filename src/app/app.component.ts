import { Component, OnInit } from '@angular/core';
import { Option } from './sm-popups/core/a-models/options';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  private tempOptionsWithEmpty:Option[] = [];
  private tempOptions:Option[] = [];
  private tempStrOptions:string[] = [];

  ngOnInit() {
    this.initOption();
  }

  private initOption() {
    setTimeout(()=>{
      this.tempOptions = [
        {id: '1', text: 'Option 1'},
        {id: '2', text: 'Option 2'},
        {id: '3', text: 'Option 3'},
        {id: '4', text: 'Option 4'},
        {id: '5', text: 'Option 5'},
      ]

      this.tempStrOptions = [
        'option 1',
        'option 2',
        'option 3',
        'option 4',
        'option 5',
      ];

      this.tempOptionsWithEmpty = [
        {id: '', text: ''},
        {id: '1', text: 'Option 1'},
        {id: '2', text: 'Option 2'},
        {id: '3', text: 'Option 3'},
        {id: '4', text: 'Option 4'},
        {id: '5', text: 'Option 5'},
      ]

    },1000);

    //console.log('app.component', this.tempOptions);
    //console.log('app.component', this.tempStrOptions);
  }


  private onStateChange($ev) {
    console.log('app.component, onStateChange: ', $ev);
  }

  private updateOptions():void {
    let id = Date.now().toString();
    this.tempOptions.push(new Option(id, 'Option ' + id));
  }

  private tmpCss = 'someCss'
  private toggleInputData():void {
    this.tmpCss = 'css-' + Date.now().toString();
  }

  private selectModel;

  private optionSelected($ev):void {
    console.log(' app.component: selected: ', $ev);
  }
}
